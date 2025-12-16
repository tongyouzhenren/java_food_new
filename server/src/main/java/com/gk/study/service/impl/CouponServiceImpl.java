package com.gk.study.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gk.study.entity.Coupon;
import com.gk.study.entity.CouponReceive;
import com.gk.study.mapper.CouponMapper;
import com.gk.study.mapper.CouponReceiveMapper;
import com.gk.study.service.CouponService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {
    @Autowired
    CouponMapper mapper;

    @Autowired
    CouponReceiveMapper couponReceiveMapper;

    @Override
    public List<Coupon> getCouponList() {
        return mapper.getList();
    }

    @Override
    public void createCoupon(Coupon coupon) {
        coupon.setCreateTime(String.valueOf(System.currentTimeMillis()));
        if (StringUtils.isBlank(coupon.getStatus())) {
            coupon.setStatus("1");
        }
        mapper.insert(coupon);
    }

    @Override
    public void deleteCoupon(String id) {
        mapper.deleteById(id);
    }

    @Override
    public void updateCoupon(Coupon coupon) {
        mapper.updateById(coupon);
    }

    @Override
    public Coupon getAvailableCoupon(String code) {
        if (StringUtils.isBlank(code)) {
            return null;
        }
        Coupon coupon = mapper.getByCode(code);
        if (coupon == null) {
            return null;
        }
        if (!"1".equals(coupon.getStatus())) {
            return null;
        }
        if (StringUtils.isNotBlank(coupon.getExpireTime())) {
            try {
                long expireTime = Long.parseLong(coupon.getExpireTime());
                if (System.currentTimeMillis() > expireTime) {
                    return null;
                }
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return coupon;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Coupon receiveCoupon(String code, String userId) {
        if (StringUtils.isBlank(userId)) {
            return null;
        }
        Coupon coupon = getAvailableCoupon(code);
        if (coupon == null) {
            return null;
        }
        CouponReceive receive = couponReceiveMapper.getUserCoupon(userId, String.valueOf(coupon.getId()));
        if (receive != null) {
            if ("1".equals(receive.getStatus())) {
                return coupon;
            } else {
                return null;
            }
        }
        CouponReceive couponReceive = new CouponReceive();
        couponReceive.setCouponId(String.valueOf(coupon.getId()));
        couponReceive.setUserId(userId);
        couponReceive.setReceiveTime(String.valueOf(System.currentTimeMillis()));
        couponReceive.setStatus("1");
        try {
            couponReceiveMapper.insert(couponReceive);
            return coupon;
        } catch (DuplicateKeyException e) {
            CouponReceive existing = couponReceiveMapper.getUserCoupon(userId, String.valueOf(coupon.getId()));
            if (existing != null && "1".equals(existing.getStatus())) {
                return coupon;
            }
            return null;
        }
    }

    @Override
    public Coupon getUserAvailableCoupon(String code, String userId) {
        if (StringUtils.isBlank(userId)) {
            return null;
        }
        Coupon coupon = getAvailableCoupon(code);
        if (coupon == null) {
            return null;
        }
        CouponReceive receive = couponReceiveMapper.getUserCoupon(userId, String.valueOf(coupon.getId()));
        if (receive == null) {
            return null;
        }
        if (!"1".equals(receive.getStatus())) {
            return null;
        }
        return coupon;
    }

    @Override
    public boolean markCouponUsed(String code, String userId) {
        if (StringUtils.isBlank(userId)) {
            return false;
        }
        Coupon coupon = getAvailableCoupon(code);
        if (coupon == null) {
            return false;
        }
        CouponReceive receive = couponReceiveMapper.getUserCoupon(userId, String.valueOf(coupon.getId()));
        if (receive == null) {
            return false;
        }
        if (!"1".equals(receive.getStatus())) {
            return false;
        }
        int updated = couponReceiveMapper.markCouponUsed(userId, String.valueOf(coupon.getId()), String.valueOf(System.currentTimeMillis()));
        return updated > 0;
    }
}
