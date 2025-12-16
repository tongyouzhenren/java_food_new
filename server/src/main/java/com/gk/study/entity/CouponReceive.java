package com.gk.study.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("b_coupon_receive")
public class CouponReceive implements Serializable {
    @TableId(value = "id", type = IdType.AUTO)
    public Long id;

    @TableField
    public String couponId;

    @TableField
    public String userId;

    @TableField
    public String status; // 1=未使用，2=已使用

    @TableField
    public String receiveTime;

    @TableField
    public String useTime;
}
