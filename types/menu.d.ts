interface MenuItem extends BasicField {
  id: string
  menuName: string
  parentId: string
  quotaId: string
  quotaName: string
  isLeaf: boolean
  children?: MenuItem[]
}
