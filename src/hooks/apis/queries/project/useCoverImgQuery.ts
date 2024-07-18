import { getCoverImg } from '@apis/project';
import { QUERY_KEY } from '@constants/queryKey';
import { useQuery } from '@tanstack/react-query';

/**
 * GET /v1/covers
 *
 * 커버 이미지 메타데이터 조회하는 api 입니다.
 */

const useCoverImgQuery = () => {
    return useQuery({
        queryKey: QUERY_KEY.COVER_IMG,
        queryFn: () => getCoverImg(),
        gcTime: 10000,
    });
};

export default useCoverImgQuery;