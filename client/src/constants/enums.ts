export enum ToastMessageEnum {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum LeftOrRight {
  LEFT,
  RIGHT,
}

export enum MentorOrMentee {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export enum NotificationTypeEnum {
  JOIN_GROUP_REQUEST = 'JOIN_GROUP_REQUEST',
  MENTORING_REQUEST = 'MENTORING_REQUEST',
  JOIN_GROUP_ACCEPTED = 'JOIN_GROUP_ACCEPTED',
  JOIN_GROUP_DECLINED = 'JOIN_GROUP_DECLINED',
  MENTORING_ACCEPTED = 'MENTORING_ACCEPTED',
  METTORING_DECLIEND = 'METTORING_DECLIEND',
}

export enum ModalTypeEnum {
  NONE = 'NONE',
  READ = 'READ',
  POST = 'POST',
  GROUP_DETAIL = 'GROUP_DETAIL',
  MENTOR_DETAIL = 'MENTOR_DETAIL',
}

export enum SearchBarTypeEnum {
  GROUP_NAME = 'GROUP_NAME',
  MENTOR_NAME = 'MENTOR_NAME',
  TECH_STACK = 'TECH_STACK',
}
export enum GroupState {
  READY = 'READY',
  DOING = 'DOING',
  END = 'END',
}

export enum ApplyState {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
}

export enum GroupEnrollmentState {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
  OWNER = 'OWNER',
}
