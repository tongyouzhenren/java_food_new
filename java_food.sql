  `coupon_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `discount_amount` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
INSERT INTO `b_order` VALUES (58, '1', '1683465611246', NULL, NULL, NULL, NULL, NULL, '43', '的地方', '33', NULL, NULL, NULL);
INSERT INTO `b_order` VALUES (69, '1', '1687948252988', NULL, 2, NULL, '{\"gwc\":[{\"id\":96,\"title\":\"黄河大鲤鱼\",\"price\":\"32\",\"count\":1},{\"id\":98,\"title\":\"鸡蛋炒肉丝\",\"price\":\"43\",\"count\":1}]}', '1687948252988', '3fddd', '刘德华', '1883333', NULL, NULL, NULL);
INSERT INTO `b_order` VALUES (70, '7', '1687948286488', NULL, 2, NULL, '{\"gwc\":[{\"id\":96,\"title\":\"黄河大鲤鱼\",\"price\":\"32\",\"count\":5},{\"id\":98,\"title\":\"鸡蛋炒肉丝\",\"price\":\"43\",\"count\":1}]}', '1687948286488', '3fddd', '刘德华', '1883333', NULL, NULL, NULL);
INSERT INTO `b_order` VALUES (71, '1', '1687948775817', NULL, 2, NULL, '{\"gwc\":[{\"id\":97,\"title\":\"测试菜品233\",\"price\":\"32\",\"count\":1}]}', '1687948775817', '3fddd', '刘德华', '1883333', NULL, NULL, NULL);
INSERT INTO `b_order` VALUES (72, '7', '1687948885745', NULL, 2, NULL, '{\"gwc\":[{\"id\":97,\"title\":\"测试菜品233\",\"price\":\"32\",\"count\":1}]}', '1687948885745', '3fddd', '刘德华', '1883333', NULL, NULL, NULL);
INSERT INTO `b_order` VALUES (73, '7', '1687948937742', NULL, 2, '32', '{\"gwc\":[{\"id\":97,\"title\":\"测试菜品233\",\"price\":\"32\",\"count\":1}]}', '1687948937742', '3fddd', '刘德华', '1883333', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for b_coupon
-- ----------------------------
DROP TABLE IF EXISTS `b_coupon`;
CREATE TABLE `b_coupon`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `discount_amount` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `expire_time` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `create_time` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `remark` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of b_coupon
-- ----------------------------
INSERT INTO `b_coupon` VALUES (1, '新客立减券', 'WELCOME10', '10', '1', NULL, '1735689600000', '新客下单满任意金额立减10元');

-- ----------------------------
-- Table structure for b_coupon_receive
-- ----------------------------
DROP TABLE IF EXISTS `b_coupon_receive`;
CREATE TABLE `b_coupon_receive`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `status` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1',
  `receive_time` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `use_time` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_coupon_user` (`coupon_id`,`user_id`)
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;
