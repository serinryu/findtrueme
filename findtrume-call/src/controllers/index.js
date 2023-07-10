import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req, api) => {
    /*
    API 서버로부터 토큰을 받아서 헤더에 넣어줘야 함.
    받은 토큰을 세션에 임시적으로 저장해두고, 헤더에 넣어줌.
    */
    try {
        // 세션에 토큰 없으면 토큰 발급.
        if(!req.session.jwt){
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        // API 서버로부터 받은 토큰을 헤더에 넣어서 요청을 보냄.
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: 'Bearer ' + req.session.jwt },
        });
    } catch (error) {
        console.log(error);
        if(error.response.status === 419){ // 토큰 만료 시
            delete req.session.jwt; // 세션에서도 기존 토큰 삭제.
            return request(req, api); // 다시 요청 보내서 토큰 받기.
        }
        return res.status(500).send(error);
    } 
};

export const getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req,'/posts/my');
        res.json(result.data);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const searchByHashtag = async (req, res, next) => {
    try {
        const result = await request(req, `/hashtags/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    } catch (error) {
        if(error.code){
            return res.status(500).send(error);
        }
    }
};

export const renderMain = async (req, res) => {
    // 브라우저에서 API 서버로 직접 요청을 보내므로 서버-브라우저 간 요청/응답임. -> CORS 문제 발생
    // CORS 문제 해결을 위해, API 서버 측 코드 수정 필요. (해당 도메인에서의 요청을 허용하도록)
    return res.render('main', { key: process.env.CLIENT_SECRET });
};