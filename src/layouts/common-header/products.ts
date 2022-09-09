const products: ProductProps[] = [
  {
    title: '数据建模',
    items: [
      { icon: 'icon-quanmianyusuan', text: '模型管理', link: '/jm/model' },
      { icon: 'icon-chengbenhesuan', text: '数据来源', link: '/jm/source' },
    ],
  },
  {
    title: '数据治理',
    items: [
      { icon: 'icon-zhibiao', text: '数据指标', link: '/manage/indicator' },
      { icon: 'icon-tag', text: '数据标签', link: '/manage/label' },
    ],
  },
  {
    title: '数据服务',
    items: [
      { icon: 'icon-canshu', text: '参数管理', link: '/manage/tag' },
      { icon: 'icon-gongshi', text: '公式管理', link: '/service/function' },
    ],
  },
]

export function findProductTitleByLink(link: string): string {
  return (
    products.find((v) => {
      const index = v.items.findIndex((v) => link.includes(v.link))
      if (index >= 0) {
        return true
      }
      return false
    })?.title || ''
  )
}

export function findKeyByLink(link: string): string {
  let key = ''
  products.forEach((v) => {
    const obj = v.items.find((e) => link.indexOf(e.link) !== -1)
    if (obj) {
      key = obj.link
    }
  })
  return key
}

export default products
