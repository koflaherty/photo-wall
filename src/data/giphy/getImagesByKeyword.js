import GphApiClient from "giphy-js-sdk-core";
import { GIPHY_API_KEY } from "../../constants/constants";

const client = GphApiClient(GIPHY_API_KEY);
console.log("Need to remove API key from codebase");

export default function(keyword, offset = 0, limit = 100) {
    return client.search('gifs', {
        q: keyword,
        limit,
        offset,
    });
}
