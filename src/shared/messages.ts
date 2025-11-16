export type CollectVideosMessage = {
  type: "collectVideos";
};

export type VideoEntry = {
  title: string;
  watchUrl: string;
  channelName?: string;
  selected: boolean;
  index: number;
};

export type SelectionSnapshot = {
  status: "success" | "noChannel" | "noVideos" | "error";
  timestamp: string;
  entries: VideoEntry[];
  reason?: string;
  totalCandidates: number;
};

export type CollectVideosResponse = SelectionSnapshot;

export type CopyLogMessage = {
  type: "logCopy";
  urlCount: number;
  status: "success" | "warning" | "failure";
  reason?: string;
  selectedUrls?: string[];
};
