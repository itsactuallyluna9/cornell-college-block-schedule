export type Calendar = {
  [school_year: string]: {
    blocks: [{
      block: number; // 1-8 guaranteed, 9+ optional
      start: Date;
      end: Date;
    }];
    events: [{
      name: string; // Fall Break, Winter Break, Spring Break, Commencement
      start: Date;
      end: Date;
    }];
  };
};
