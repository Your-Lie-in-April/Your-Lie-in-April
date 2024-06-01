import styled from 'styled-components';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React, { useEffect, useState } from 'react';
import { ModalBlackOut, ModalContainer } from './ModalCommon';
import ModalPortal from '#/utils/ModalPotal';
import useScrollLock from '#/utils/useScrollLock';
import { useParams } from 'react-router-dom';
import { MemberEntity } from '#/Types/membertype';
import { Http } from '#/constants/backendURL';

const Box = styled.div`
    width: 406px;
    height: 181px;
    border-radius: 20px;
    background: #f5f5f5;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0px 8px 0px;
    box-sizing: border-box;
`;

const InfoCircleIcon = styled(InfoOutlinedIcon)`
    width: 32px;
    height: 32px;
    color: #eb5757;
`;

const MemPickDiv = styled.div`
    width: 208px;
    height: 32px;
    padding: 4px;
    display: flex;
    gap: 12px;
    box-sizing: border-box;
    color: #000000;
    font-size: 20px;
    text-align: center;

    position: relative;
`;

export const MemDropdown = styled.div`
    width: 208px;
    height: 124px;
    border-radius: 5px;
    background: #f5f5f5;
    z-index: 3;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: absolute;
    top: 45px;
    right: 0;

    ::-webkit-scrollbar {
        display: none;
    }

    li {
        list-style: none;
        width: 100%;
        height: 30px;
        text-align: center;
        color: #7d7d7d;
    }

    li:hover {
        background: #633ae2;
        color: #ffffff;
    }
`;

const CommonText = styled.text`
    color: #000000;
    text-align: center;
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const MemberNick = styled(CommonText)`
    font-size: 20px;
`;

const Button = styled.button`
    display: flex;
    width: 60px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    font-family: Pretendard;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    border: none;

    &:focus {
        outline: none;
    }
`;

const ConfirmBtn = styled(Button)`
    background: #633ae2;
    color: #ffffff;
`;

const CancelBtn = styled(Button)`
    background: #d9d9d9;
    color: #ffffff;
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 4px;
`;

interface TransferAuthModalProps {
    isAuthClick: boolean;
    onIsAuthClick: () => void;
}
const TransferAuthModal: React.FC<TransferAuthModalProps> = ({ isAuthClick, onIsAuthClick }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [members, setMembers] = useState<MemberEntity[] | undefined>();
    const [selectMem, setSelectMem] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const fetchMember = async () => {
            try {
                const response = await fetch(`${Http}/v1/projects/${projectId}/members`, {
                    method: 'GET',
                    headers: {
                        Accept: '*/*',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pinned projects');
                }

                const data = await response.json();
                console.log('멤버', data.data);
                if (data.data.length > 0) {
                    setSelectMem(data.data[0].nickname);
                }
                setMembers(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMember();
    }, [projectId]);

    const handleSetSelectMem = (mem: any) => {
        setSelectMem(mem);
        setIsOpen(false);
    };

    const handleSetIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleConfirm = () => {
        onIsAuthClick();
    };

    useScrollLock(isAuthClick);

    return (
        <>
            {isAuthClick && (
                <ModalPortal>
                    <ModalBlackOut onClick={onIsAuthClick} />
                    <ModalContainer>
                        <Box>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <InfoCircleIcon sx={{ fontSize: '32px' }} />
                                    <MemPickDiv onClick={handleSetIsOpen}>
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: '12px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ul
                                                style={{
                                                    width: '100%',
                                                    listStyle: 'none',
                                                }}
                                                onClick={handleSetIsOpen}
                                            >
                                                <li>{selectMem}</li>
                                            </ul>
                                            {isOpen ? (
                                                <ExpandLessIcon
                                                    style={{
                                                        width: '12px',
                                                        height: '11px',
                                                    }}
                                                />
                                            ) : (
                                                <ExpandMoreIcon
                                                    style={{
                                                        width: '12px',
                                                        height: '11px',
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {isOpen && members && (
                                            <MemDropdown>
                                                {members.map((mem) => (
                                                    <li key={mem.memberId} onClick={() => handleSetSelectMem(mem)}>
                                                        {mem.nickname}
                                                    </li>
                                                ))}
                                            </MemDropdown>
                                        )}
                                    </MemPickDiv>

                                    <CommonText>
                                        <MemberNick>{selectMem}</MemberNick> 에게 권한을 양도하겠습니까?
                                    </CommonText>
                                </div>
                                <ButtonsContainer
                                    style={{
                                        alignSelf: 'flex-end',
                                        padding: '0 20px 0 20px',
                                    }}
                                >
                                    <ConfirmBtn onClick={handleConfirm}>확인</ConfirmBtn>
                                    <CancelBtn onClick={onIsAuthClick}>취소</CancelBtn>
                                </ButtonsContainer>
                            </div>
                        </Box>
                    </ModalContainer>
                </ModalPortal>
            )}
        </>
    );
};

export default TransferAuthModal;
