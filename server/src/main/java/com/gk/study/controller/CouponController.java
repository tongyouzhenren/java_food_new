package com.gk.study.controller;

import com.gk.study.common.APIResponse;
import com.gk.study.common.ResponeCode;
import com.gk.study.entity.Coupon;
import com.gk.study.entity.User;
import com.gk.study.permission.Access;
import com.gk.study.permission.AccessLevel;
import com.gk.study.service.CouponService;
import com.gk.study.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    @Autowired
    CouponService service;

    @Autowired
    UserService userService;

    @Access(level = AccessLevel.ADMIN)
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public APIResponse list() {
        List<Coupon> list = service.getCouponList();
        return new APIResponse(ResponeCode.SUCCESS, "查询成功", list);
    }

    @Access(level = AccessLevel.ADMIN)
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public APIResponse create(Coupon coupon) {
        service.createCoupon(coupon);
        return new APIResponse(ResponeCode.SUCCESS, "创建成功");
    }

    @Access(level = AccessLevel.ADMIN)
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public APIResponse update(Coupon coupon) {
        service.updateCoupon(coupon);
        return new APIResponse(ResponeCode.SUCCESS, "更新成功");
    }

    @Access(level = AccessLevel.ADMIN)
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public APIResponse delete(String ids) {
        String[] arr = ids.split(",");
        for (String id : arr) {
            service.deleteCoupon(id);
        }
        return new APIResponse(ResponeCode.SUCCESS, "删除成功");
    }

    @Access(level = AccessLevel.LOGIN)
    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public APIResponse check(String code, HttpServletRequest request) {
        String userId = getUserId(request);
        Coupon coupon = service.getUserAvailableCoupon(code, userId);
        if (coupon == null) {
            return new APIResponse(ResponeCode.FAIL, "优惠口令无效、未领取或已过期");
        }
        return new APIResponse(ResponeCode.SUCCESS, "口令验证成功", coupon);
    }

    @Access(level = AccessLevel.LOGIN)
    @RequestMapping(value = "/receive", method = RequestMethod.POST)
    public APIResponse receive(String code, HttpServletRequest request) {
        String userId = getUserId(request);
        Coupon coupon = service.receiveCoupon(code, userId);
        if (coupon == null) {
            return new APIResponse(ResponeCode.FAIL, "优惠口令无效、已使用或已过期");
        }
        return new APIResponse(ResponeCode.SUCCESS, "领取成功", coupon);
    }

    private String getUserId(HttpServletRequest request) {
        User user = userService.getUserByToken(request.getHeader("TOKEN"));
        return user == null ? null : String.valueOf(user.getId());
    }
}
