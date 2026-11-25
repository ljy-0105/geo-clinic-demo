window.GEO_DATA = {
 "meta": {
  "project": "门店 GEO 监测",
  "generatedAt": "2026-11-25T14:59:11+08:00",
  "dataNote": "历史探针：DeepSeek API 60 次、豆包网页 20 次、腾讯元宝网页 20 次。按通道独立统计；网页仅一轮。旧记录时间未核验，非今日自动采集结果。",
  "primary": "doubao__web",
  "primaryLabel": "豆包 · 网页端",
  "platforms": 3,
  "rounds": 1,
  "channelNote": "每个平台与访问通道分别计算；详情参考通道按固定顺序选取，不代表主指标或推荐排名。",
  "metricsVersion": "credibility-2.0"
 },
 "store": {
  "id": "HQ-DG-DC",
  "brand_name": "环球美天（东莞东城院区）",
  "license_name": "东莞市环球美天医疗美容门诊部",
  "display_name": "环球美天医疗美容 东城院区",
  "alias_names": "环球美天;环球美天医疗美容;CLBG;东莞环球美天",
  "city": "东莞",
  "district": "东城街道",
  "landmark": "星河城",
  "address": "东莞市东城街道东城东路229号之三2栋102室",
  "lng": 113.78,
  "lat": 23.02,
  "coord_system": "GCJ-02",
  "phone": "0769-22369292",
  "open_hours": "09:30-21:00",
  "org_type": "门诊部",
  "business_status": "在营",
  "license_no": "PDY20491X44190019D1542",
  "license_expiry": "2027-12-22",
  "subjects": "医疗美容科;美容外科;美容皮肤科",
  "subject_codes": "M101;M102;M103",
  "services": "热玛吉;超声炮;光子嫩肤;玻尿酸;水光针",
  "booking_entry": "电话",
  "poi_ids": "amap=TBD;baidu=TBD;dianping=TBD",
  "created_at": "2026-11-25 03:08:45"
 },
 "facts": [
  {
   "key": "license_name",
   "label": "机构第一名称",
   "expected": "东莞市环球美天医疗美容门诊部",
   "status": "arbitrated",
   "by": "客户签字",
   "at": "2026-11-25"
  },
  {
   "key": "address",
   "label": "标准地址",
   "expected": "东莞市东城街道东城东路229号之三2栋102室",
   "status": "pending",
   "by": null,
   "at": null
  },
  {
   "key": "phone",
   "label": "联系电话",
   "expected": "0769-22369292",
   "status": "arbitrated",
   "by": "客户签字",
   "at": "2026-11-25"
  },
  {
   "key": "open_hours",
   "label": "营业时间",
   "expected": "09:30-21:00",
   "status": "arbitrated",
   "by": "客户签字",
   "at": "2026-11-25"
  },
  {
   "key": "subjects",
   "label": "科室",
   "expected": "医疗美容科;美容外科;美容皮肤科",
   "status": "pending",
   "by": null,
   "at": null
  },
  {
   "key": "license_no",
   "label": "许可证号",
   "expected": "PDY20491X44190019D1542",
   "status": "pending",
   "by": null,
   "at": null
  },
  {
   "key": "booking_entry",
   "label": "预约方式",
   "expected": "电话",
   "status": "pending",
   "by": null,
   "at": null
  },
  {
   "key": "org_type",
   "label": "机构类别",
   "expected": "门诊部",
   "status": "arbitrated",
   "by": "客户签字",
   "at": "2026-11-25"
  }
 ],
 "kpi": {
  "m1": {
   "hit": 5,
   "total": 20,
   "rate": 0.25,
   "ci_low": 0.11186170140766569,
   "ci_high": 0.468700877618744,
   "deff": 1.0,
   "eff_n": 20.0,
   "ci_low_eff": 0.11186170140766569,
   "ci_high_eff": 0.468700877618744,
   "half_width_eff": 17.8
  },
  "m2Macro": 0.5,
  "m2Items": 2,
  "m2Arbitrated": 4,
  "m3": {
   "total": 0,
   "selfOpen": 0,
   "otherTotal": 0,
   "otherResponded": 0,
   "otherResp": null
  },
  "d1": {
   "rate": null,
   "hit": 0,
   "n": 0,
   "ci_low": 0.0,
   "ci_high": 1.0
  },
  "grade": "reference",
  "mdd": 0.3836228551833759,
  "deff": 1.0,
  "sov": {
   "self": 7,
   "all": 38,
   "answers": 20,
   "rate": 0.18421052631578946
  },
  "pos": {
   "mean": 1.2,
   "n": 5
  },
  "lowN": false,
  "icc": {
   "icc": 0.0,
   "mBar": 0.0,
   "msb": 0.0,
   "msw": 0.0
  }
 },
 "m2Coverage": {
  "nItems": 2,
  "totalItems": 8,
  "arbitrated": 4
 },
 "m2": [
  {
   "key": "license_name",
   "label": "机构第一名称",
   "status": "ok",
   "rate": 0.0,
   "n": 5,
   "correct": 0,
   "ciLow": 0.0,
   "ciHigh": 0.43448246478317476,
   "lowN": true,
   "unjudged": 0
  },
  {
   "key": "address",
   "label": "标准地址",
   "status": "unarbitrated",
   "rate": null,
   "n": 0
  },
  {
   "key": "phone",
   "label": "联系电话",
   "status": "not_mentioned",
   "rate": null,
   "n": 0,
   "unjudged": 0
  },
  {
   "key": "open_hours",
   "label": "营业时间",
   "status": "not_mentioned",
   "rate": null,
   "n": 0,
   "unjudged": 0
  },
  {
   "key": "subjects",
   "label": "科室",
   "status": "unarbitrated",
   "rate": null,
   "n": 0
  },
  {
   "key": "license_no",
   "label": "许可证号",
   "status": "unarbitrated",
   "rate": null,
   "n": 0
  },
  {
   "key": "booking_entry",
   "label": "预约方式",
   "status": "unarbitrated",
   "rate": null,
   "n": 0
  },
  {
   "key": "org_type",
   "label": "机构类别",
   "status": "ok",
   "rate": 1.0,
   "n": 1,
   "correct": 1,
   "ciLow": 0.20654931437723745,
   "ciHigh": 1.0,
   "lowN": true,
   "unjudged": 0
  }
 ],
 "d1": {
  "rate": null,
  "hit": 0,
  "n": 0,
  "ci_low": 0.0,
  "ci_high": 1.0
 },
 "ceiling": {
  "p": 0.55,
  "q": 0.2727272727272727,
  "L": 3.272727272727273,
  "n": 20,
  "listN": 11,
  "selfListN": 3,
  "prompts": 20,
  "equalShare": 0.3055555555555555,
  "equalM1": 0.16805555555555557,
  "twoSlotM1": 0.33611111111111114,
  "ratio": 0.8925619834710744,
  "stablePrompts": 0,
  "stableRate": null
 },
 "form": {
  "mention": 11,
  "no_mention": 2,
  "method_only": 7,
  "refusal": 0,
  "total": 20
 },
 "formLabel": {
  "mention": "提及（给了名单）",
  "no_mention": "未提及（给了建议没点名）",
  "method_only": "只给方法",
  "refusal": "拒答"
 },
 "platforms": [
  {
   "key": "doubao__web",
   "platform": "doubao",
   "label": "豆包 · 网页端",
   "endpoint": "web",
   "channel": "web",
   "rate": 0.25,
   "hit": 5,
   "total": 20,
   "ciLow": 0.11186170140766569,
   "ciHigh": 0.468700877618744,
   "half": 17.8,
   "effN": 20.0,
   "rounds": 1,
   "words": 20,
   "deff": 1.0,
   "p": 0.55,
   "q": 0.2727272727272727,
   "L": 3.272727272727273,
   "ceiling": {
    "p": 0.55,
    "q": 0.2727272727272727,
    "L": 3.272727272727273,
    "n": 20,
    "listN": 11,
    "selfListN": 3,
    "prompts": 20,
    "equalShare": 0.3055555555555555,
    "equalM1": 0.16805555555555557,
    "twoSlotM1": 0.33611111111111114,
    "ratio": 0.8925619834710744,
    "stablePrompts": 0,
    "stableRate": null
   },
   "forms": {
    "mention": 11,
    "no_mention": 2,
    "method_only": 7,
    "refusal": 0,
    "total": 20
   },
   "refusal": 0.0,
   "m2": [
    {
     "key": "license_name",
     "label": "机构第一名称",
     "status": "ok",
     "rate": 0.0,
     "n": 5,
     "correct": 0,
     "ciLow": 0.0,
     "ciHigh": 0.43448246478317476,
     "lowN": true,
     "unjudged": 0
    },
    {
     "key": "address",
     "label": "标准地址",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "phone",
     "label": "联系电话",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "open_hours",
     "label": "营业时间",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "subjects",
     "label": "科室",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "license_no",
     "label": "许可证号",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "booking_entry",
     "label": "预约方式",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "org_type",
     "label": "机构类别",
     "status": "ok",
     "rate": 1.0,
     "n": 1,
     "correct": 1,
     "ciLow": 0.20654931437723745,
     "ciHigh": 1.0,
     "lowN": true,
     "unjudged": 0
    }
   ],
   "m2Summary": {
    "nItems": 2,
    "totalItems": 8,
    "macro": 0.5,
    "lowN": true,
    "minN": 1,
    "maxN": 5,
    "answerN": 5
   },
   "d1": {
    "rate": null,
    "hit": 0,
    "n": 0,
    "ci_low": 0.0,
    "ci_high": 1.0
   },
   "lowN": false,
   "primary": true,
   "sov": {
    "self": 7,
    "all": 38,
    "answers": 20,
    "rate": 0.18421052631578946
   },
   "pos": {
    "mean": 1.2,
    "n": 5
   }
  },
  {
   "key": "yuanbao__web",
   "platform": "yuanbao",
   "label": "腾讯元宝 · 网页端",
   "endpoint": "web",
   "channel": "web",
   "rate": 0.15,
   "hit": 3,
   "total": 20,
   "ciLow": 0.052368745896216595,
   "ciHigh": 0.36041886474075696,
   "half": 15.4,
   "effN": 20.0,
   "rounds": 1,
   "words": 20,
   "deff": 1.0,
   "p": 0.5,
   "q": 0.2,
   "L": 5.0,
   "ceiling": {
    "p": 0.5,
    "q": 0.2,
    "L": 5.0,
    "n": 20,
    "listN": 10,
    "selfListN": 2,
    "prompts": 20,
    "equalShare": 0.2,
    "equalM1": 0.1,
    "twoSlotM1": 0.2,
    "ratio": 1.0,
    "stablePrompts": 0,
    "stableRate": null
   },
   "forms": {
    "mention": 10,
    "no_mention": 0,
    "method_only": 10,
    "refusal": 0,
    "total": 20
   },
   "refusal": 0.0,
   "m2": [
    {
     "key": "license_name",
     "label": "机构第一名称",
     "status": "ok",
     "rate": 0.0,
     "n": 3,
     "correct": 0,
     "ciLow": 5.551115123125783e-17,
     "ciHigh": 0.5614970317550454,
     "lowN": true,
     "unjudged": 0
    },
    {
     "key": "address",
     "label": "标准地址",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "phone",
     "label": "联系电话",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "open_hours",
     "label": "营业时间",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "subjects",
     "label": "科室",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "license_no",
     "label": "许可证号",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "booking_entry",
     "label": "预约方式",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "org_type",
     "label": "机构类别",
     "status": "ok",
     "rate": 1.0,
     "n": 1,
     "correct": 1,
     "ciLow": 0.20654931437723745,
     "ciHigh": 1.0,
     "lowN": true,
     "unjudged": 0
    }
   ],
   "m2Summary": {
    "nItems": 2,
    "totalItems": 8,
    "macro": 0.5,
    "lowN": true,
    "minN": 1,
    "maxN": 3,
    "answerN": 3
   },
   "d1": {
    "rate": null,
    "hit": 0,
    "n": 0,
    "ci_low": 0.0,
    "ci_high": 1.0
   },
   "lowN": false,
   "primary": false,
   "sov": {
    "self": 4,
    "all": 51,
    "answers": 20,
    "rate": 0.0784313725490196
   },
   "pos": {
    "mean": 1.0,
    "n": 3
   }
  },
  {
   "key": "deepseek__api",
   "platform": "deepseek",
   "label": "DeepSeek · API",
   "endpoint": "api",
   "channel": "api",
   "rate": 0.0,
   "hit": 0,
   "total": 60,
   "ciLow": 0.0,
   "ciHigh": 0.11351339317396876,
   "half": 5.7,
   "effN": 30.0,
   "rounds": 3,
   "words": 20,
   "deff": 2.0,
   "p": 0.0,
   "q": null,
   "L": null,
   "ceiling": {
    "p": 0.0,
    "q": null,
    "L": null,
    "n": 60,
    "listN": 0,
    "selfListN": 0,
    "prompts": 20,
    "equalShare": null,
    "equalM1": null,
    "twoSlotM1": null,
    "ratio": null,
    "stablePrompts": 0,
    "stableRate": 0.0
   },
   "forms": {
    "mention": 0,
    "no_mention": 0,
    "method_only": 60,
    "refusal": 0,
    "total": 60
   },
   "refusal": 0.0,
   "m2": [
    {
     "key": "license_name",
     "label": "机构第一名称",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "address",
     "label": "标准地址",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "phone",
     "label": "联系电话",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "open_hours",
     "label": "营业时间",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    },
    {
     "key": "subjects",
     "label": "科室",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "license_no",
     "label": "许可证号",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "booking_entry",
     "label": "预约方式",
     "status": "unarbitrated",
     "rate": null,
     "n": 0
    },
    {
     "key": "org_type",
     "label": "机构类别",
     "status": "not_mentioned",
     "rate": null,
     "n": 0,
     "unjudged": 0
    }
   ],
   "m2Summary": {
    "nItems": 0,
    "totalItems": 8,
    "macro": null,
    "lowN": false,
    "minN": 0,
    "maxN": 0,
    "answerN": 0
   },
   "d1": {
    "rate": null,
    "hit": 0,
    "n": 0,
    "ci_low": 0.0,
    "ci_high": 1.0
   },
   "lowN": false,
   "primary": false,
   "sov": {
    "self": 0,
    "all": 0,
    "answers": 60,
    "rate": 0.0
   },
   "pos": {
    "mean": null,
    "n": 0
   }
  }
 ],
 "roundsSeries": [
  {
   "round": 1,
   "total": 20,
   "hit": 5,
   "rate": 0.25
  }
 ],
 "commonPrompts": [
  {
   "text": "东莞玻尿酸哪家好",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞热玛吉哪家好",
   "doubao__web": {
    "n": 1,
    "hit": 1
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 1
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞超声炮哪家好",
   "doubao__web": {
    "n": 1,
    "hit": 1
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞光子嫩肤哪家好",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 1
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞水光针哪家好",
   "doubao__web": {
    "n": 1,
    "hit": 1
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞热玛吉哪家正规",
   "doubao__web": {
    "n": 1,
    "hit": 1
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "星河城附近哪里可以做热玛吉",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞做热玛吉大概多少钱",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "星河城附近哪里可以做超声炮",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞超声炮哪家正规",
   "doubao__web": {
    "n": 1,
    "hit": 1
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 1
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞做超声炮大概多少钱",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "星河城附近哪里可以做光子嫩肤",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞光子嫩肤哪家正规",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞做光子嫩肤大概多少钱",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "星河城附近哪里可以做玻尿酸",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞玻尿酸哪家正规",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞做玻尿酸大概多少钱",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "星河城附近哪里可以做水光针",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞水光针哪家正规",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  },
  {
   "text": "东莞做水光针大概多少钱",
   "doubao__web": {
    "n": 1,
    "hit": 0
   },
   "yuanbao__web": {
    "n": 1,
    "hit": 0
   },
   "deepseek__api": {
    "n": 3,
    "hit": 0
   }
  }
 ],
 "incidents": [],
 "prompts": [
  {
   "id": 1,
   "text": "星河城附近哪里可以做热玛吉",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "nearby",
   "intentLabel": "附近",
   "project": "热玛吉",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 2,
   "text": "东莞热玛吉哪家好",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_best",
   "intentLabel": "哪家好",
   "project": "热玛吉",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 3,
   "text": "东莞热玛吉哪家正规",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_regular",
   "intentLabel": "哪家正规",
   "project": "热玛吉",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 4,
   "text": "东莞做热玛吉大概多少钱",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "price",
   "intentLabel": "价格",
   "project": "热玛吉",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 5,
   "text": "星河城附近哪里可以做超声炮",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "nearby",
   "intentLabel": "附近",
   "project": "超声炮",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 6,
   "text": "东莞超声炮哪家好",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_best",
   "intentLabel": "哪家好",
   "project": "超声炮",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 7,
   "text": "东莞超声炮哪家正规",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_regular",
   "intentLabel": "哪家正规",
   "project": "超声炮",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 8,
   "text": "东莞做超声炮大概多少钱",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "price",
   "intentLabel": "价格",
   "project": "超声炮",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 9,
   "text": "星河城附近哪里可以做光子嫩肤",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "nearby",
   "intentLabel": "附近",
   "project": "光子嫩肤",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 10,
   "text": "东莞光子嫩肤哪家好",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_best",
   "intentLabel": "哪家好",
   "project": "光子嫩肤",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 11,
   "text": "东莞光子嫩肤哪家正规",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_regular",
   "intentLabel": "哪家正规",
   "project": "光子嫩肤",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 12,
   "text": "东莞做光子嫩肤大概多少钱",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "price",
   "intentLabel": "价格",
   "project": "光子嫩肤",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 13,
   "text": "星河城附近哪里可以做玻尿酸",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "nearby",
   "intentLabel": "附近",
   "project": "玻尿酸",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 14,
   "text": "东莞玻尿酸哪家好",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_best",
   "intentLabel": "哪家好",
   "project": "玻尿酸",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 15,
   "text": "东莞玻尿酸哪家正规",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_regular",
   "intentLabel": "哪家正规",
   "project": "玻尿酸",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 16,
   "text": "东莞做玻尿酸大概多少钱",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "price",
   "intentLabel": "价格",
   "project": "玻尿酸",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 17,
   "text": "星河城附近哪里可以做水光针",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "nearby",
   "intentLabel": "附近",
   "project": "水光针",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 18,
   "text": "东莞水光针哪家好",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_best",
   "intentLabel": "哪家好",
   "project": "水光针",
   "priority": "P0",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 1,
     "rate": 1.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 19,
   "text": "东莞水光针哪家正规",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "which_regular",
   "intentLabel": "哪家正规",
   "project": "水光针",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  },
  {
   "id": 20,
   "text": "东莞做水光针大概多少钱",
   "layer": "L3project",
   "layerLabel": "L3 项目",
   "denom": "store_answerable",
   "denomLabel": "门店可答",
   "intent": "price",
   "intentLabel": "价格",
   "project": "水光针",
   "priority": "P1",
   "channels": {
    "doubao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "yuanbao__web": {
     "n": 1,
     "hit": 0,
     "rate": 0.0,
     "rounds": 1,
     "stable": null,
     "stabilityStatus": "insufficient_rounds"
    },
    "deepseek__api": {
     "n": 3,
     "hit": 0,
     "rate": 0.0,
     "rounds": 3,
     "stable": false,
     "stabilityStatus": "not_repeated"
    }
   }
  }
 ],
 "wordCounts": {
  "store_answerable": 20,
  "knowledge": 0,
  "verification": 0,
  "brand": 0
 },
 "promptTotal": 20,
 "obsTotal": 100,
 "recent": [
  {
   "id": 133,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做水光针大概多少钱"
  },
  {
   "id": 132,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做玻尿酸大概多少钱"
  },
  {
   "id": 131,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做光子嫩肤大概多少钱"
  },
  {
   "id": 130,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做超声炮大概多少钱"
  },
  {
   "id": 129,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做热玛吉大概多少钱"
  },
  {
   "id": 128,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做水光针"
  },
  {
   "id": 127,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做玻尿酸"
  },
  {
   "id": 126,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做光子嫩肤"
  },
  {
   "id": 125,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做超声炮"
  },
  {
   "id": 124,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做热玛吉"
  },
  {
   "id": 123,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞水光针哪家正规"
  },
  {
   "id": 122,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞玻尿酸哪家正规"
  },
  {
   "id": 121,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞光子嫩肤哪家正规"
  },
  {
   "id": 120,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞超声炮哪家正规"
  },
  {
   "id": 119,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞热玛吉哪家正规"
  },
  {
   "id": 118,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞水光针哪家好"
  },
  {
   "id": 117,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞玻尿酸哪家好"
  },
  {
   "id": 116,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞光子嫩肤哪家好"
  },
  {
   "id": 115,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞超声炮哪家好"
  },
  {
   "id": 114,
   "platform": "腾讯元宝",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T12:02:53",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞热玛吉哪家好"
  },
  {
   "id": 113,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "no_mention",
   "formLabel": "未提及（给了建议没点名）",
   "citation": false,
   "text": "东莞做水光针大概多少钱"
  },
  {
   "id": 112,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞水光针哪家正规"
  },
  {
   "id": 111,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做水光针"
  },
  {
   "id": 110,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "no_mention",
   "formLabel": "未提及（给了建议没点名）",
   "citation": false,
   "text": "东莞做玻尿酸大概多少钱"
  },
  {
   "id": 109,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞玻尿酸哪家正规"
  },
  {
   "id": 108,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做玻尿酸"
  },
  {
   "id": 107,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做光子嫩肤大概多少钱"
  },
  {
   "id": 106,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞光子嫩肤哪家正规"
  },
  {
   "id": 105,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "星河城附近哪里可以做光子嫩肤"
  },
  {
   "id": 104,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做超声炮大概多少钱"
  },
  {
   "id": 103,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:35:41",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞超声炮哪家正规"
  },
  {
   "id": 102,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "星河城附近哪里可以做超声炮"
  },
  {
   "id": 101,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞做热玛吉大概多少钱"
  },
  {
   "id": 100,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "星河城附近哪里可以做热玛吉"
  },
  {
   "id": 99,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞热玛吉哪家正规"
  },
  {
   "id": 98,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞水光针哪家好"
  },
  {
   "id": 97,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞光子嫩肤哪家好"
  },
  {
   "id": 96,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "method_only",
   "formLabel": "只给方法",
   "citation": false,
   "text": "东莞超声炮哪家好"
  },
  {
   "id": 95,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞热玛吉哪家好"
  },
  {
   "id": 94,
   "platform": "豆包",
   "endpoint": "web",
   "round": 1,
   "at": null,
   "askedAt": null,
   "recordedAt": null,
   "legacyAt": "2026-11-25T11:29:20",
   "timeSource": "legacy_unverified",
   "form": "mention",
   "formLabel": "提及（给了名单）",
   "citation": false,
   "text": "东莞玻尿酸哪家好"
  }
 ]
};
