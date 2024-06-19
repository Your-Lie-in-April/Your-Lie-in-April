import { Http } from '#/constants/backendURL';
import { MemberEntity } from '#/Types/membertype';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChangeNickName from '../../Modal/ChangeNickname';

const MyProfileBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
`;

const ImageDiv = styled.div`
    width: 68px;
    height: 68px;
    border-radius: 40px;
    background: #aeaeae;
    overflow: hidden;
`;

const StyledImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const MyProfileNick = styled.div`
    display: flex;
    width: 168px;
    padding: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    box-sizing: border-box;
    border-radius: 10px;
    background: #633ae2;
    color: #ffffff;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const EditButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;

    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;

    &:focus {
        border: none;
        outline: none;
    }
`;

const EditIcon: React.FC = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='22'
        height='22'
        viewBox='0 0 22 22'
        fill='none'
    >
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
        >
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                viewBox='0 0 22 22'
                fill='none'
            >
                <path
                    d='M4.75617 16.8906C4.80527 16.8906 4.85438 16.8856 4.90349 16.8783L9.0334 16.1539C9.08251 16.1441 9.12916 16.122 9.16353 16.0852L19.5718 5.67694C19.5946 5.65422 19.6126 5.62724 19.6249 5.59754C19.6373 5.56784 19.6436 5.53599 19.6436 5.50384C19.6436 5.47168 19.6373 5.43984 19.6249 5.41013C19.6126 5.38043 19.5946 5.35345 19.5718 5.33073L15.491 1.24747C15.4443 1.20082 15.383 1.17627 15.3167 1.17627C15.2504 1.17627 15.189 1.20082 15.1423 1.24747L4.73407 11.6557C4.69724 11.6926 4.67514 11.7368 4.66532 11.7859L3.94099 15.9158C3.9171 16.0473 3.92564 16.1827 3.96585 16.3102C4.00607 16.4377 4.07676 16.5535 4.17179 16.6475C4.33385 16.8046 4.53764 16.8906 4.75617 16.8906ZM6.41108 12.6084L15.3167 3.70529L17.1164 5.50506L8.21085 14.4082L6.02804 14.7937L6.41108 12.6084ZM20.0359 18.9531H1.96443C1.52983 18.9531 1.17871 19.3042 1.17871 19.7388V20.6227C1.17871 20.7307 1.2671 20.8191 1.37514 20.8191H20.6251C20.7332 20.8191 20.8216 20.7307 20.8216 20.6227V19.7388C20.8216 19.3042 20.4705 18.9531 20.0359 18.9531Z'
                    fill='#B79FFF'
                />
            </svg>
        </svg>
    </svg>
);

const MyEmailText = styled.div`
    color: #fff;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const MyStatus = styled.div`
    width: 100%;
    height: 30px;
    padding: 7px 13px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background: #ffffff;
    box-sizing: border-box;

    color: #000000;
    text-align: center;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const CommonText = styled.div`
    color: #000000;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;
const defaultImg = 'src/pics/default.png';
const MyProfile = () => {
    const [isEditModal, setIsEditModal] = useState(false);
    const [me, setMe] = useState<MemberEntity>();
    const memberId = localStorage.getItem('member_id');

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const fetchMe = async () => {
            const url = `${Http}/v1/members/${memberId}`;
            const headers = {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
            };

            try {
                const response = await fetch(url, { headers });
                if (!response.ok) {
                    throw new Error('데이터 가져오기 실패');
                }
                const data = await response.json();
                setMe(data.data);
                console.log('본인 데이터:', data);
            } catch (error) {
                console.error('API 요청 중 에러 발생:', error);
            }
        };
        fetchMe();
    }, [memberId]);

    const onSetIsEditModal = () => {
        setIsEditModal((prev) => !prev);
    };

    return (
        <>
            <MyProfileBox>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '22px',
                    }}
                >
                    <ImageDiv>
                        <StyledImage
                            src={me?.profileImageUrl || defaultImg}
                            alt='Profile Image'
                        />
                    </ImageDiv>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '10px',
                        }}
                    >
                        <MyProfileNick>
                            <div
                                style={{
                                    width: '144px',
                                    height: '22px',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <CommonText
                                    style={{
                                        width: '106px',
                                        fontSize: '14px',
                                        color: '#ffffff',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {me?.nickname}
                                </CommonText>
                                <EditButton onClick={onSetIsEditModal}>
                                    <EditIcon />
                                </EditButton>
                            </div>
                        </MyProfileNick>
                        <MyEmailText>{me?.email}</MyEmailText>
                    </div>
                </div>
                <MyStatus>{me?.state}</MyStatus>
            </MyProfileBox>
            <ChangeNickName
                onSetIsEditModal={onSetIsEditModal}
                isEditModal={isEditModal}
            />
        </>
    );
};
export default MyProfile;
