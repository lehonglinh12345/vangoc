import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Comment, User } from '../types';

export interface ContactMessageData {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Subscribe to real-time comments on a project
export function subscribeToComments(
  projectId: string,
  onUpdate: (comments: Comment[]) => void
) {
  const path = `projects/${projectId}/comments`;
  try {
    const colRef = collection(db, 'projects', projectId, 'comments');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const comments: Comment[] = snapshot.docs.map((d) => {
          const data = d.data({ serverTimestamps: 'estimate' });
          let createdAtStr = data.createdAtStr || 'Vừa xong';
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            const date = data.createdAt.toDate();
            const diffMs = Date.now() - date.getTime();
            const diffMinutes = Math.floor(diffMs / 60000);
            if (diffMinutes < 1) {
              createdAtStr = 'Vừa xong';
            } else if (diffMinutes < 60) {
              createdAtStr = `${diffMinutes} phút trước`;
            } else {
              const diffHours = Math.floor(diffMinutes / 60);
              if (diffHours < 24) {
                createdAtStr = `${diffHours} giờ trước`;
              } else {
                const diffDays = Math.floor(diffHours / 24);
                if (diffDays < 30) {
                  createdAtStr = `${diffDays} ngày trước`;
                } else {
                  createdAtStr = date.toLocaleDateString('vi-VN');
                }
              }
            }
          }
          return {
            id: d.id,
            project_id: projectId,
            user_id: data.userId || 'guest',
            user_name: data.userName || 'Khách',
            user_avatar: data.userAvatar || '/images/logo.png',
            content: data.content || '',
            created_at: createdAtStr,
            is_edited: data.isEdited || data.is_edited || false,
            parent_id: data.parentId || data.parent_id || null,
            reply_to_name: data.replyToName || data.reply_to_name || '',
            likes: data.likes || 0,
            user_reacted: false,
          };
        });
        onUpdate(comments);
      },
      (error) => {
        console.warn('Firestore comments snapshot error with orderBy, attempting plain query fallback:', error);
        onSnapshot(
          colRef,
          (snapshot) => {
            const comments: Comment[] = snapshot.docs.map((d) => {
              const data = d.data({ serverTimestamps: 'estimate' });
              return {
                id: d.id,
                project_id: projectId,
                user_id: data.userId || 'guest',
                user_name: data.userName || 'Khách',
                user_avatar: data.userAvatar || '/images/logo.png',
                content: data.content || '',
                created_at: data.createdAtStr || 'Vừa xong',
                is_edited: data.isEdited || data.is_edited || false,
                parent_id: data.parentId || data.parent_id || null,
                reply_to_name: data.replyToName || data.reply_to_name || '',
                likes: data.likes || 0,
                user_reacted: false,
              };
            });
            onUpdate(comments);
          },
          (err2) => {
            handleFirestoreError(err2, OperationType.LIST, path);
          }
        );
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Add a new comment or reply to Firestore
export async function addCommentToFirestore(
  projectId: string,
  comment: {
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    parentId?: string | null;
    replyToName?: string;
  }
) {
  const commentId = 'c_' + Date.now();
  const path = `projects/${projectId}/comments/${commentId}`;

  try {
    const docRef = doc(db, 'projects', projectId, 'comments', commentId);
    await setDoc(docRef, {
      projectId,
      userId: comment.userId,
      userName: comment.userName,
      userAvatar: comment.userAvatar || '/images/logo.png',
      content: comment.content,
      parentId: comment.parentId || null,
      replyToName: comment.replyToName || '',
      createdAt: serverTimestamp(),
      createdAtStr: 'Vừa xong',
      likes: 0,
    });
    return commentId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Edit a comment in Firestore
export async function editCommentInFirestore(
  projectId: string,
  commentId: string,
  newContent: string
) {
  const path = `projects/${projectId}/comments/${commentId}`;
  try {
    const docRef = doc(db, 'projects', projectId, 'comments', commentId);
    await updateDoc(docRef, {
      content: newContent,
      isEdited: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Toggle like for a comment
export async function toggleCommentLike(
  projectId: string,
  commentId: string,
  newLikesCount: number
) {
  const path = `projects/${projectId}/comments/${commentId}`;
  try {
    const docRef = doc(db, 'projects', projectId, 'comments', commentId);
    await updateDoc(docRef, {
      likes: newLikesCount,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Delete a comment
export async function deleteCommentFromFirestore(
  projectId: string,
  commentId: string
) {
  const path = `projects/${projectId}/comments/${commentId}`;
  try {
    const docRef = doc(db, 'projects', projectId, 'comments', commentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Save contact inquiry message to Firestore
export async function saveContactInquiry(messageData: ContactMessageData) {
  const contactId = 'msg_' + Date.now();
  const path = `contacts/${contactId}`;

  try {
    const docRef = doc(db, 'contacts', contactId);
    await setDoc(docRef, {
      id: contactId,
      name: messageData.name,
      email: messageData.email,
      service: messageData.service,
      message: messageData.message,
      createdAt: serverTimestamp(),
    });
    return contactId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to project likes count
export function subscribeToProjectLikes(
  projectId: string,
  onUpdate: (likesCount: number, userIds: string[]) => void
) {
  const path = `projects/${projectId}/likes`;
  try {
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const userIds = snapshot.docs.map((d) => d.id);
        onUpdate(snapshot.size, userIds);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Toggle project like
export async function toggleProjectLikeInFirestore(
  projectId: string,
  userId: string,
  currentlyLiked: boolean
) {
  const path = `projects/${projectId}/likes/${userId}`;
  try {
    const docRef = doc(db, 'projects', projectId, 'likes', userId);
    if (currentlyLiked) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        projectId,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      currentlyLiked ? OperationType.DELETE : OperationType.CREATE,
      path
    );
  }
}

// Save or update user profile in Firestore
export async function saveUserProfileInFirestore(user: User) {
  const path = `users/${user.id}`;
  try {
    const docRef = doc(db, 'users', user.id);
    await setDoc(
      docRef,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '/images/logo.png',
        role: user.role || 'user',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Get user profile from Firestore
export async function getUserProfileFromFirestore(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: data.id || userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role || 'user',
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

