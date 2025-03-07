import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { formatDateToString } from '@utils/Date';
import { groupHttpClient, mentoringHttpClient } from '@api';
import { SimpleMentoringRequest, MentoringRequestPostData, OwnGroup } from '@types';
import { useAppDispatch, useAppSelector, useToast } from '@hooks';
import { mentorCardDetailState } from '@store/mentor/cardDetailSlice';
import { changeGroupModalState } from '@store/util/Slice';
import { useHistory } from 'react-router';
import { MentorButtonType, ModalTypeEnum } from '@constants/enums';
import {
  APPLY_CANCEL,
  APPLY_TEXT,
  LOADING_LIST_TEXT,
  MENTORIG_MODAL_EMPTY_TEXT,
  MSG_MENTOR_APPLY_SUCCESS,
  MSG_MENTOR_CANCEL_SUCCESS,
  SHOW_GROUP,
  SUGGEST_CREATE_NEW_GROUP_INFO,
} from '@constants/consts';
import { keyframes } from '@emotion/react';

function GroupList(): JSX.Element {
  const [ownGroups, setOwnGroups] = useState<OwnGroup[]>([]);
  const [toastify] = useToast();
  const [allMentoringRequests, setAllMentoringRequests] = useState<SimpleMentoringRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mentorId } = useAppSelector(mentorCardDetailState);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const getOwnGroups = async () => {
    const allOwnGroups = (await groupHttpClient.getOwnGroups()).filter((group) => !group.mentorId);
    const allMentoringRequests = await mentoringHttpClient.getAllMentoringRequests();
    setOwnGroups(allOwnGroups);
    setAllMentoringRequests(allMentoringRequests);
    setIsLoading(false);
  };

  useEffect(() => {
    getOwnGroups();
  }, []);

  const handleButtonClick = (type: string, groupId: number) => {
    return async () => {
      if (type === MentorButtonType.GROUP_INFO) {
        history.push({ pathname: `/group/${groupId}` });
      } else if (type === MentorButtonType.APPLY_BUTTON) {
        const postData: MentoringRequestPostData = { groupId, mentorId };
        await mentoringHttpClient.postMentoringRequests(postData);
        toastify(MSG_MENTOR_APPLY_SUCCESS, 'SUCCESS');
      } else if (type === MentorButtonType.CANCEL_BUTTON) {
        const deleteQuery = `?mentor=${mentorId}&group=${groupId}`;
        await mentoringHttpClient.deleteMentoringRequests(deleteQuery);
        toastify(MSG_MENTOR_CANCEL_SUCCESS, 'SUCCESS');
      }

      
      dispatch(changeGroupModalState(ModalTypeEnum.NONE));
    };
  };

  const renderEmptyMessage = (
    <>
      <EmptyMessage>{MENTORIG_MODAL_EMPTY_TEXT}</EmptyMessage>
      <SubMessage>{SUGGEST_CREATE_NEW_GROUP_INFO}</SubMessage>
    </>
  );

  const makeRequestBox = ownGroups.map((group) => {
    const alreadyRequestMentoring = allMentoringRequests.find(
      (mentoringRequest) =>
        mentoringRequest.group.id === group.id && mentoringRequest.mentor.id === mentorId,
    );

    return (
      <BoxContainer key={group.id}>
        <CategoryContainer>
          <CategoryImage src={group.category.imageUrl} alt="카테고리 이미지" />
          <CategoryText>{group.category.name}</CategoryText>
        </CategoryContainer>
        <GroupInfo>
          <GroupName>{group.name}</GroupName>
          <GroupIntro>{group.intro}</GroupIntro>
        </GroupInfo>
        <GroupDueDate>
          {formatDateToString(group.startAt)} ~ {formatDateToString(group.endAt)}
        </GroupDueDate>
        <ButtonWrapper>
          <GroupInfoButton onClick={handleButtonClick(MentorButtonType.GROUP_INFO, group.id)}>
            {SHOW_GROUP}
          </GroupInfoButton>
          {alreadyRequestMentoring ? (
            <CancelButton onClick={handleButtonClick(MentorButtonType.CANCEL_BUTTON, group.id)}>
              {APPLY_CANCEL}
            </CancelButton>
          ) : (
            <ApplyButton onClick={handleButtonClick(MentorButtonType.APPLY_BUTTON, group.id)}>
              {APPLY_TEXT}
            </ApplyButton>
          )}
        </ButtonWrapper>
      </BoxContainer>
    );
  });

  return (
    <Container>
      <ScrollContainer>
        {isLoading ? (
          <LoadingText>{LOADING_LIST_TEXT}</LoadingText>
        ) : (
          <>{ownGroups.length === 0 ? <>{renderEmptyMessage}</> : <>{makeRequestBox}</>}</>
        )}
      </ScrollContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const ScrollContainer = styled.div`
  height: 450px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BoxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 450px;
  height: 120px;
  margin: 0 auto 20px auto;
  border-radius: 5px;
  border: 1px ${(props) => props.theme.Gray5} solid;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 85px;
  margin: 20px;
  justify-content: space-between;
`;

const CategoryImage = styled.img`
  width: 60px;
  height: 60px;
  margin: 5px 0px;
  padding: 5px;
  border: 1px ${(props) => props.theme.Gray5} solid;
  border-radius: 10px;
  object-fit: fill;
`;

const CategoryText = styled.h4`
  text-align: center;
`;

const GroupDueDate = styled.h5`
  color: ${(props) => props.theme.Gray3};
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 5px;
  margin-right: 20px;
`;

const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const GroupText = styled.p`
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: ${(props) => props.theme.PrimaryDark};
`;

const GroupName = styled(GroupText)`
  width: 300px;
  font-size: 15px;
  color: ${(props) => props.theme.Black};
`;

const GroupIntro = styled(GroupText)`
  width: 200px;
  font-size: 12px;
  color: ${(props) => props.theme.Gray4};
`;

const Button = styled.button`
  margin: 0px 4px;
  padding: 2px 10px;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 hsl(0deg 0% 81% / 50%);
`;

const ApplyButton = styled(Button)`
  background-color: ${(props) => props.theme.Primary};
  color: ${(props) => props.theme.White};
`;

const CancelButton = styled(Button)`
  background-color: ${(props) => props.theme.White};
  color: ${(props) => props.theme.Red};
`;

const GroupInfoButton = styled(Button)`
  color: ${(props) => props.theme.Primary};
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  margin-left: auto;
`;

const dots = keyframes`
  0%, 20% {
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 Black,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 Black,
      .5em 0 0 Black;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 150px;

  &::after {
    content: ' .';
    animation: ${dots} 0.15s steps(5, end) infinite;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 100px;
`;
const SubMessage = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => props.theme.Gray3};
  margin-top: 20px;
`;

export default GroupList;
