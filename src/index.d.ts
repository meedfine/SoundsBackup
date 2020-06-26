interface FileDes {
  path: string;
  name: string;
  size?: number;
}

interface FolderDes extends FileDes {
  folders: FolderDes[];
  files: FileDes[];
}

interface AudioDes {
  album: string | undefined;
  title: string | undefined;
  artists: string[] | undefined;
  duration: number | undefined;
  size?: number;
  path?: string;
  name?: string;
  picture?: Buffer | undefined;
}

type PlayType = "round" | "single" | "random" | "sequence"; // 循环 单曲 随机 顺序
