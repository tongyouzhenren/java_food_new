package com.gk.study.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gk.study.entity.Coupon;
import com.gk.study.entity.Order;
import com.gk.study.mapper.OrderMapper;
import com.gk.study.service.CouponService;
import com.gk.study.service.OrderService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {
    @Autowired
    OrderMapper mapper;

    @Autowired
    CouponService couponService;

    private final Gson gson = new Gson();

    @Override
    public List<Order> getOrderList() {
        return mapper.getList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createOrder(Order order) {
        long ct = System.currentTimeMillis();
        order.setOrderTime(String.valueOf(ct));
        order.setOrderNumber(String.valueOf(ct));
        order.setStatus("1");
        BigDecimal originAmount = calculateAmount(order.getGwc());
        Coupon coupon = StringUtils.isNotBlank(order.getCouponCode())
                ? couponService.getUserAvailableCoupon(order.getCouponCode(), order.getUserId())
                : null;
        BigDecimal discount = calculateDiscount(coupon, originAmount);
        if (discount.compareTo(BigDecimal.ZERO) > 0) {
            boolean marked = couponService.markCouponUsed(order.getCouponCode(), order.getUserId());
            if (!marked) {
                discount = BigDecimal.ZERO;
            }
        }
        BigDecimal finalAmount = originAmount.subtract(discount);
        order.setAmount(finalAmount.toPlainString());
        order.setDiscountAmount(discount.toPlainString());
        mapper.insert(order);
    }

    @Override
    public void deleteOrder(String id) {
        mapper.deleteById(id);
    }

    @Override
    public void updateOrder(Order order) {
        mapper.updateById(order);
    }

    @Override
    public List<Order> getUserOrderList(String userId, String status) {
        return mapper.getUserOrderList(userId, status);
//        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
//        queryWrapper.eq("user_id", userId);
//        if (StringUtils.isNotBlank(status)) {
//            queryWrapper.eq("status", status);
//        }
//        queryWrapper.orderBy(true, false, "order_time");
//        return mapper.selectList(queryWrapper);
    }

    private BigDecimal calculateAmount(String gwcText) {
        if (StringUtils.isBlank(gwcText)) {
            return BigDecimal.ZERO;
        }
        try {
            JsonObject root = gson.fromJson(gwcText, JsonObject.class);
            JsonArray array = root.getAsJsonArray("gwc");
            BigDecimal amount = BigDecimal.ZERO;
            for (JsonElement element : array) {
                JsonObject item = element.getAsJsonObject();
                BigDecimal price = new BigDecimal(item.get("price").getAsString());
                int count = item.get("count").getAsInt();
                amount = amount.add(price.multiply(BigDecimal.valueOf(count)));
            }
            return amount;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal originAmount) {
        if (coupon == null) {
            return BigDecimal.ZERO;
        }
        try {
            BigDecimal discount = new BigDecimal(coupon.getDiscountAmount());
            if (discount.compareTo(originAmount) > 0) {
                return originAmount;
            }
            return discount;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}
