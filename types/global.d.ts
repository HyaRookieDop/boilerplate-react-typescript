type Indexable<T = any> = {
  [key: string]: T;
};

interface pager {
  pageNo: number;
  pageSize: number;
  total: number;
}
interface BasicResponseModel<T = any> {
  responseCode: string | number;
  responseMessage: string;
  data: T;
  pager: pager;
  // [key: string]: T;
}

interface ProductProps {
  title: string;
  items: Array<{ icon: string; text: string; link: string }>;
}

interface BasicField {
  createUser: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
}
