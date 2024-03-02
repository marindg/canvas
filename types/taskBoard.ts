export interface TaskBoard {
  orgId: string;
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageUserName: string;
  imageLinkHTML: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export type CardWithList = Card & { list: List };
export type ListWithCards = List & { cards: Card[] };

export type List = {
  title: string;
  order: number;
  boardId: string;
  _creationTime: number;
  _id: string;
};

export interface Card {
  title: string;
  order: number;
  description?: string;
  listId: string;
  _createdAt: Date;
}

enum ACTION {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

enum ENTITY_TYPE {
  TASKBOARD = "TASKBOARD",
  LIST = "LIST",
  CARD = "CARD",
}

export interface AuditLog {
  orgId: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgLimit {
  orgId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgSubscription {
  orgId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
}
