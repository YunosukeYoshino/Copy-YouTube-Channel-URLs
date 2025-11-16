export type CollectVideosMessage = {
  type: "collectVideos";
};

export type CollectVideosResponse =
  | {
      status: "success";
      urls: string[];
      deduplicated: number;
    }
  | {
      status: "noChannel";
      reason: string;
    }
  | {
      status: "noVideos";
      reason: string;
    }
  | {
      status: "error";
      reason: string;
    };

export type CopyLogMessage = {
  type: "logCopy";
  urlCount: number;
  status: "success" | "warning" | "failure";
  reason?: string;
};
