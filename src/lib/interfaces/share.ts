import type {
  PartialContentNavigateFields,
  PickedContentNavigate,
} from '@/lib/interfaces/articles';

export type ContentBySlug<T extends object> = { md_content: string } & T;

export type Category = {
  type: 'category';
  name:
    | (
        | 'context'
        | 'enero'
        | 'febrero'
        | 'febrero-25'
        | 'marzo'
        | 'abril'
        | 'mayo'
        | 'junio'
        | 'julio'
        | 'agosto'
        | 'septiembre'
        | 'octubre'
        | 'noviembre'
        | 'diciembre'
      )
    | 'tale'
    | 'further';
};

export type ContentNavigate = PickedContentNavigate & PartialContentNavigateFields;
export type AllContentNavigate = {
  articles: ContentNavigate[];
  tales: ContentNavigate[];
  further: ContentNavigate[];
};
