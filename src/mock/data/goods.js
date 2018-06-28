import Mock from 'mockjs'

// 商品数据
export const Goods = Mock.mock({
  'list|333': [
    {
      'productId|+1': 1,
      // 产品名
      'productName|1': [
        'FIIL Driifter 脖挂蓝牙耳机',
        '优点智能 E1 推拉式智能指纹密码锁',
        'ACIL E1 颈挂式蓝牙耳机',
        'Smartisan 明信片',
        'Smartisan 牛津纺衬衫',
        `Smartisan T恤 任天堂发售“红白机”`,
        'Smartisan 帆布鞋”',
        '坚果 3 "足迹"背贴 乐高创始人出生”'
      ],
      // 展示图3张,可切换
      'small': [
        `@dataImage(400x400,这是预览图1)`,
        `@dataImage(400x400,这是预览图2)`,
        `@dataImage(400x400,这是预览图3)`
      ],
      // 产品标题
      'subTitle': '@name',
      // 售价
      'salePrice|10-19999.2': 1,
      // 列表图
      'productImageBig': `@dataImage(250x250,这是测试图片)`,
      // 库存
      'limitNum|1-5': 1,
      // banner图
      'banner': `@dataImage(1200x500,这是测试图片)`
    }
  ]
})

// 品牌周边
export const BrandSide = Mock.mock({
  'list|8': [
    {
      'productId|+1': 1,
      // 产品名
      'productName|1': [
        'FIIL Driifter 脖挂蓝牙耳机',
        'Smartisan 帆布鞋”',
        'Ipad',
        'Mac book',
        'HuaWei',
        'Nuojiya',
        '网球拍'
      ],
      // 展示图3张,可切换
      'small': [
        `@dataImage(400x400,这是预览图1)`,
        `@dataImage(400x400,这是预览图2)`,
        `@dataImage(400x400,这是预览图3)`
      ],
      // 产品标题
      'subTitle': '@name',
      // 售价
      'salePrice|10-19999.2': 1,
      // 列表图
      'productImageBig': `@dataImage(250x250,这是测试图片)`,
      // 库存
      'limitNum|1-5': 1
    }
  ]
})
