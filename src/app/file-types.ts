export type FileType = {
  mime: string;
  extension: string;
};

export const fileTypes: FileType[] = [
  {mime: 'image/png', extension: '.png'},
  {mime: 'image/jpeg', extension: '.jpg'}
];
