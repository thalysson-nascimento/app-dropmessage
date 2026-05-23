import {
  NotificationModel,
  NotificationType,
} from '../interface/notification.interface';

export const notificationMock: NotificationModel[] = [
  {
    id: '1',
    type: NotificationType.LIKE,
    actors: [
      {
        id: 'u1',
        name: 'Thalysson Nascimento',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
    ],
    target: {
      id: 'p1',
      type: 'photo',
      thumbnailUrl: 'https://picsum.photos/200/200?random=1',
    },
    createdAt: new Date(),
    isRead: false,
    match: false,
  },
  {
    id: '2',
    type: NotificationType.LIKE,
    actors: [
      {
        id: 'u2',
        name: 'Ana Souza',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
    ],
    target: {
      id: 'p2',
      type: 'video',
      thumbnailUrl: 'https://picsum.photos/200/200?random=2',
    },
    meta: {
      totalCount: 13,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    isRead: true,
    match: true,
  },
  {
    id: '3',
    type: NotificationType.COMMENT,
    actors: [
      {
        id: 'u3',
        name: 'Gabriel Lima',
        avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      },
    ],
    target: {
      id: 'p3',
      type: 'photo',
      thumbnailUrl: 'https://picsum.photos/200/200?random=3',
    },
    meta: {
      commentText:
        'Incrível essa é incrivelmente linda não esperava por ela! 👏',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false,
    match: false,
  },
  {
    id: '4',
    type: NotificationType.LIKE,
    actors: [
      {
        id: 'u4',
        name: 'Marcela Dias',
        avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      },
    ],
    target: {
      id: 'p3',
      type: 'photo',
      thumbnailUrl: 'https://picsum.photos/200/200?random=3',
    },
    meta: {
      isFollowing: false,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
    match: true,
  },
];
