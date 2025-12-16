package com.gk.study.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gk.study.entity.CouponReceive;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CouponReceiveMapper extends BaseMapper<CouponReceive> {

    CouponReceive getUserCoupon(@Param("userId") String userId, @Param("couponId") String couponId);

    int markCouponUsed(@Param("userId") String userId, @Param("couponId") String couponId, @Param("useTime") String useTime);
}
