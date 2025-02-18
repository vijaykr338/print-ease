import { create } from "zustand";
import { Config } from "@/interfaces";

interface FilesStore {
  filesWithConfigs: { file: File; config: Config }[];  

  addFile: (file: File, config: Config) => void;
  updateFileConfig: (fileName: string, updatedConfig: Partial<Config>) => void;
  deleteFile: (fileName: string) => void;
  clearAll: () => void;
};

const useFileStore = create<FilesStore>((set) => ({
  filesWithConfigs: [],

  addFile: (file, config) => {
  
    set((state) => ({
      filesWithConfigs: [...state.filesWithConfigs, { file, config }]
    }));
  },

  updateFileConfig: (fileName, updatedConfig) =>
    set((state) => ({
      filesWithConfigs: state.filesWithConfigs.map((item) =>
        item.file.name === fileName
          ? { ...item, config: { ...item.config, ...updatedConfig } }
          : item
      ),
    })),

  deleteFile: (fileName) =>
    set((state) => ({
      filesWithConfigs: state.filesWithConfigs.filter(
        (item) => item.file.name !== fileName
      ),
    })),

  clearAll: () => set({ filesWithConfigs: [] }),
}));

export default useFileStore;
