/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { postHttpClient } from '@api';
import { GroupPostRequestDto } from '@types';
import { useAppDispatch, useAppSelector, useToast } from '@hooks';
import { changeGroupModalState } from '@store/util/Slice';
import { selectGroupDetail } from '@store/group/detailSlice';
import { setPosts, selectChoosenPost } from '@store/group/postSlice';
import PostTypeNav from './PostTypeNav';
import {
  MSG_NEED_INFO,
  MSG_POST_CREATE_SUCCESS,
  MSG_POST_CREATE_ERROR,
  MSG_POST_UPDATE_SUCCESS,
  MSG_POST_UPDATE_ERROR,
  TITLE_INTRO,
  CONTENT_INTRO,
  EDIT_POST,
  WRITE_POST,
} from '@constants/consts';
import { ModalTypeEnum } from '@constants/enums';
import CancelIcon from '@assets/icon_cancel.png';

interface Props {
  mode: string;
}

function PostModal({ mode }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const [toastify] = useToast();
  const group = useAppSelector(selectGroupDetail);
  const post = useAppSelector(selectChoosenPost);
  const [title, setTitle] = useState<string>(
    (mode === ModalTypeEnum.UPDATE ? post?.title : '') as string,
  );
  const [content, setContent] = useState<string>(
    (mode === ModalTypeEnum.UPDATE ? post?.content : '') as string,
  );
  const [selectedType, setSelectedType] = useState<string>('NORMAL');
  const isCompleted = title.length > 0 && content.length > 0;

  const handlePostNavItemClick =
    (type: string): (() => void) =>
    () =>
      setSelectedType(type);

  const handleTitleInputChange = ({ target }: ChangeEvent<EventTarget & HTMLInputElement>) => {
    setTitle(target.value);
  };

  const handleContentInputChange = ({ target }: ChangeEvent<EventTarget & HTMLTextAreaElement>) => {
    setContent(target.value);
  };

  const handlePostButtonClick = async () => {
    if (!isCompleted) {
      toastify(MSG_NEED_INFO, 'INFO');
      return;
    }

    try {
      const postData: GroupPostRequestDto = {
        id: mode === ModalTypeEnum.POST ? undefined : post?.id,
        groupId: group.id,
        title,
        content,
        type: selectedType,
      };

      if (mode === ModalTypeEnum.POST) {
        await postHttpClient.createPost(postData);
        toastify(MSG_POST_CREATE_SUCCESS, 'SUCCESS');
      } else if (mode === ModalTypeEnum.UPDATE) {
        await postHttpClient.updatePost(postData);
        toastify(MSG_POST_UPDATE_SUCCESS, 'SUCCESS');
      }

      dispatch(changeGroupModalState(ModalTypeEnum.NONE));
      const groupPosts = await postHttpClient.getGroupPosts(group.id);
      dispatch(setPosts(groupPosts));
    } catch (e: any) {
      if (mode === ModalTypeEnum.POST) toastify(MSG_POST_CREATE_ERROR, 'ERROR');
      else if (mode === ModalTypeEnum.UPDATE) toastify(MSG_POST_UPDATE_ERROR, 'ERROR');
    }
  };

  const handleCancelButtonClick = () => dispatch(changeGroupModalState(ModalTypeEnum.NONE));

  if (!post && mode === ModalTypeEnum.UPDATE) return <></>;
  return (
    <Container>
      <Header>
        <Title>{mode === ModalTypeEnum.UPDATE ? EDIT_POST : WRITE_POST}</Title>
        <CancelButton src={CancelIcon} onClick={handleCancelButtonClick} alt="취소 아이콘" />
      </Header>
      <Content>
        <PostTypeNav selectedType={selectedType} handlePostNavItemClick={handlePostNavItemClick} />
        <TitleInput
          data-test="post-modal-title-input"
          onChange={handleTitleInputChange}
          value={title}
          placeholder={TITLE_INTRO}
        ></TitleInput>
        <ContentInput
          data-test="post-modal-content-input"
          onChange={handleContentInputChange}
          value={content}
          placeholder={CONTENT_INTRO}
        ></ContentInput>
      </Content>
      <PostButton data-test="modal-post-btn" active={isCompleted} onClick={handlePostButtonClick}>
        {mode === ModalTypeEnum.UPDATE ? '수정' : '작성'}
      </PostButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1.75px solid ${(props) => props.theme.Gray4};
`;

const Title = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.Gray2};
`;
const CancelButton = styled.img`
  position: absolute;
  right: 8px;
  width: 14px;
  height: 14px;
  filter: invert(17%) sepia(7%) saturate(21%) hue-rotate(353deg) brightness(104%) contrast(94%);
  cursor: pointer;
`;

const Content = styled.div`
  padding: 12px;
`;
const TitleInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 8px 12px 8px 12px;
  border: 0.025rem solid ${(props) => props.theme.Gray5};
  border-radius: 18px;
  margin-bottom: 12px;
  resize: none;
  box-shadow: inset 0 2px 4px 0 hsl(0deg 0% 81% / 50%);
  outline-color: ${(props) => props.theme.Primary};
  outline-width: 0.025rem;
`;

const ContentInput = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 8px 12px 8px 12px;
  border: 1.75px solid ${(props) => props.theme.Gray5};
  border-radius: 18px;
  resize: none;
  box-shadow: inset 0 2px 4px 0 hsl(0deg 0% 81% / 50%);
  outline-color: ${(props) => props.theme.Primary};
  outline-width: 1px;
`;

type PostButtonProps = {
  active: boolean;
};
const PostButton = styled.span<PostButtonProps>`
  position: absolute;
  bottom: 16px;
  right: 36px;
  width: fit-content;
  padding: 6px 12px 6px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.White};
  border-radius: 12px;
  background-color: ${(props) => (props.active ? props.theme.Primary : props.theme.Gray3)};
  cursor: pointer;
`;

export default PostModal;
