import { ipcRenderer } from "electron";
import fs from "fs";
import * as mm from "music-metadata";
const fsPromises = fs.promises;
const funcGroup = {
  async chooseFolder(): Promise<string> {
    return new Promise(reslove => {
      ipcRenderer.send("openDirectoryDialog");
      ipcRenderer.once("openDirectoryDialog", (event, arg) => {
        reslove(arg);
      });
    });
  },
  async readFolder(path: string): Promise<FolderDes> {
    const dirName = path + "\\";
    const items = await fsPromises.readdir(dirName);
    const folders: FolderDes[] = [];
    const files: FileDes[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = dirName + item;
      await fsPromises
        .lstat(itemPath)
        .then(stat => {
          console.log(1);
          stat.isDirectory()
            ? folders.push({
                path: itemPath,
                name: item,
                folders: [],
                files: []
              })
            : files.push({
                path: itemPath,
                name: item,
                size: stat.size
              });
        })
        .catch(err => {
          console.log(err);
        });
    }
    return {
      name: path.split("\\").pop() as string,
      path: path,
      folders: folders,
      files: files
    };
  },
  async readMetadata(path: string): Promise<AudioDes | void> {
    return mm
      .parseFile(path)
      .then(metadata => {
        const audioInfo: AudioDes = {
          album: metadata.common.album,
          artists: metadata.common.artists,
          title: metadata.common.title,
          duration: metadata.format.duration,
          picture: metadata.common.picture?.[0].data
        };
        return audioInfo;
      })
      .catch(() => {
        // console.error(err.message);
      });
  },
  async readAudioFile(path: string): Promise<any> {
    return fsPromises.readFile(path);
  },
  getPrevIndex(mode: PlayType, length: number, curIndex?: number) {
    if (mode == "random") {
      if (length == 0 || length == 1) {
        return 0;
      }
      let randomNum = -1;
      do {
        randomNum = Math.floor(Math.random() * length);
      } while (randomNum == curIndex);
      return randomNum;
    } else if (mode == "round") {
      if (curIndex === undefined) {
        curIndex = length;
      }
      let newIndex = curIndex - 1;
      if (newIndex < 0) {
        newIndex += length;
      }
      return newIndex;
    } else if (mode == "sequence") {
      if (curIndex === undefined) {
        curIndex = length;
      }
      let newIndex = curIndex - 1;
      if (newIndex < 0) {
        newIndex = -1;
      }
      return newIndex;
    } else if (mode == "single") {
      if (curIndex === undefined) {
        curIndex = 0;
      }
      return curIndex;
    }
  },
  getNextIndex(mode: PlayType, length: number, curIndex?: number) {
    if (mode == "random") {
      if (length == 0 || length == 1) {
        return 0;
      }
      let randomNum = -1;
      do {
        randomNum = Math.floor(Math.random() * length);
      } while (randomNum == curIndex);

      return randomNum;
    } else if (mode == "round") {
      if (curIndex === undefined) {
        curIndex = -1;
      }
      let newIndex = curIndex + 1;
      if (newIndex >= length) {
        newIndex -= length;
      }
      return newIndex;
    } else if (mode == "sequence") {
      if (curIndex === undefined) {
        curIndex = -1;
      }
      let newIndex = curIndex + 1;
      if (newIndex >= length) {
        newIndex = -1;
      }
      return newIndex;
    } else if (mode == "single") {
      if (curIndex === undefined) {
        curIndex = 0;
      }
      return curIndex;
    }
  }
};
export default funcGroup;
