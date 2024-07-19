import { ProjectCreateUpate, ProjectEntity } from '@/types/projectType';
import usePutProjectMutation from '@hooks/apis/mutations/project/usePutProjectMutation';
import useCoverImgQuery from '@hooks/apis/queries/project/useCoverImgQuery';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const colors = ['#633AE2', '#FFCB3B', '#64AFF5', '#C2D57A', '#EB5757', '#212121'];

interface CoverProps {
    onColorSelect: (color: string) => void;
    onImageSelect: (url: string, id: string) => void;
    onHexSelect: (color: string) => void;
    title?: string;
    content?: string;
    projectData?: ProjectEntity | null;
    setEditCover?: Dispatch<SetStateAction<boolean>>;
    imgId?: string;
}

const ProjectCoverPicker: FC<CoverProps> = ({
    onColorSelect,
    onImageSelect,
    onHexSelect,
    title,
    content,
    projectData,
    setEditCover,
    imgId,
}) => {
    const [color, setColor] = useState(projectData?.color || '');
    const [openHex, setOpenHex] = useState<boolean>(false);
    const { data: images } = useCoverImgQuery();

    const handleColorClick = (color: string) => {
        setColor(color);
        onColorSelect(color);
    };

    const handleImageClick = (page0Url: string, page0Id: string) => {
        if (images) {
            const page1Image = images.page1Data.data.find(
                (_, index) => images.page0Data.data[index].id === page0Id
            );
            if (page1Image) {
                onImageSelect(page1Image.url, page1Image.id);
            }
        }
    };

    const handleColorChange = useCallback(
        (color: ColorResult) => {
            let hexCode = color.hex;
            if (color.rgb.a !== 1) {
                hexCode = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            }
            setColor(hexCode);
            onHexSelect(hexCode);
        },
        [onHexSelect]
    );

    const toggleHex = () => {
        setOpenHex((prev) => !prev);
    };

    const { projectId } = useParams();
    const mutate = usePutProjectMutation(Number(projectId));

    const updateProject = async () => {
        const effectiveTitle = title || projectData?.title;
        const effectiveDescription = content || projectData?.description;

        const payload: Partial<ProjectCreateUpate> = {
            title: effectiveTitle,
            description: effectiveDescription,
        };

        if (color && color !== projectData?.color) {
            payload.color = color;
            payload.coverImageId = '';
        } else if (imgId && imgId !== projectData?.coverImageId) {
            payload.coverImageId = imgId;
            payload.color = '';
        }

        if (projectData?.startDate) {
            payload.startDate =
                typeof projectData.startDate === 'string'
                    ? projectData.startDate
                    : new Date(projectData.startDate).toISOString();
        }
        if (projectData?.endDate) {
            payload.endDate =
                typeof projectData.endDate === 'string'
                    ? projectData.endDate
                    : new Date(projectData.endDate).toISOString();
        }
        if (projectData?.daysOfWeek) {
            payload.daysOfWeek = projectData.daysOfWeek;
        }
        try {
            try {
                await mutate.mutateAsync(payload);
                if (setEditCover) {
                    setEditCover(false);
                }
            } catch (error) {
                console.error('Error updating project:', error);
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <CoverContainer>
            <ConverInnerContainer>
                <Register style={{ fontSize: '18px' }} onClick={updateProject}>
                    커버등록
                </Register>
                <ColorContainer>
                    단색
                    <ColorChoose>
                        <Color onClick={toggleHex}>
                            <AddCircleRoundedIcon sx={{ fontSize: '36px', color: '#D9D9D9' }} />
                        </Color>
                        {colors.map((color, index) => (
                            <Color
                                key={index}
                                style={{ background: color }}
                                onClick={() => handleColorClick(color)}
                            ></Color>
                        ))}
                        <Color
                            style={{
                                background: '#ffffff',
                                border: '1px solid black',
                            }}
                            onClick={() => handleColorClick('#ffffff')}
                        />
                    </ColorChoose>
                </ColorContainer>
                <ImageContainer>
                    이미지
                    <ImageChoose>
                        {images ? (
                            images.page0Data.data.map((item) => (
                                <Image
                                    key={item.id}
                                    style={{
                                        backgroundImage: `url('${item.url}')`,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => handleImageClick(item.url, item.id)}
                                ></Image>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </ImageChoose>
                </ImageContainer>
            </ConverInnerContainer>
            {openHex ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '252px',
                        position: 'absolute',
                        right: 'calc(100% + 8px)',
                        bottom: '0',
                    }}
                >
                    <ChromePicker
                        disableAlpha={false}
                        color={color}
                        onChange={(selectedColor) => handleColorChange(selectedColor)}
                        styles={{
                            default: {
                                picker: {
                                    borderRadius: '6px',
                                },
                            },
                        }}
                    />
                </div>
            ) : null}
        </CoverContainer>
    );
};
export default ProjectCoverPicker;

const CoverContainer = styled.div`
    width: 300px;
    height: 292px;
    display: flex;
    gap: 8px;
    border-radius: 8px;
    background: var(--gray00, #fbfbfb);
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    position: relative;
`;

const ConverInnerContainer = styled.div`
    width: 272px;
    height: 276px;
    padding: 8px 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 13px;
`;

const Register = styled.button`
    display: flex;
    width: 82px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 40px;
    background: #633ae2;
    white-space: nowrap;
    color: white;

    &:focus {
        outline: none;
    }
`;

const ColorContainer = styled.div`
    width: 268px;
    height: 62px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 20px;
`;
const ColorChoose = styled.div`
    width: 268px;
    height: 30px;
    display: flex;
    align-items: flex-start;
    gap: 4px;
`;
const Color = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
        cursor: pointer;
    }
`;

const ImageContainer = styled.div`
    width: 272px;
    height: 148px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 20px;
`;
const ImageChoose = styled.div`
    width: 272px;
    height: 116px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 8px;
`;
const Image = styled.div`
    width: 50px;
    height: 50px;
    margin: 0;
    padding: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
`;
