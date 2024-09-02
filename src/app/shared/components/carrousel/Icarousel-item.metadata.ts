export interface ICarouselItem {
  id: number;
  title?: {
    first: string;
    second: string;
  };
  subtile?: string;
  link?: string;
  image?: string;
  order?: number;
  marginLeft?: number;
}
