package com.gk.study.service;

import com.gk.study.entity.Coupon;

import java.util.List;

public interface CouponService {
    List<Coupon> getCouponList();

    void createCoupon(Coupon coupon);

    void deleteCoupon(String id);

    void updateCoupon(Coupon coupon);

    Coupon getAvailableCoupon(String code);

    Coupon receiveCoupon(String code, String userId);

    Coupon getUserAvailableCoupon(String code, String userId);

    boolean markCouponUsed(String code, String userId);
}
