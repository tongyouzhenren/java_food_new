package com.gk.study.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("b_coupon")
public class Coupon implements Serializable {
    @TableId(value = "id", type = IdType.AUTO)
    public Long id;

    @TableField
    public String title; // 优惠券名称

    @TableField
    public String code; // 兑换口令

    @TableField
    public String discountAmount; // 优惠金额

    @TableField
    public String status; // 1=启用, 0=停用

    @TableField
    public String expireTime; // 过期时间（时间戳）

    @TableField
    public String createTime;

    @TableField
    public String remark;
}
