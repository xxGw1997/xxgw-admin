export type Category = {
  id: number;
  img: string;
  title: string;
};

export type DeleteCategoryReturnType = {
  countInUse: number;
};
