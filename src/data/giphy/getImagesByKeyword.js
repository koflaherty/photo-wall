import GphApiClient from "giphy-js-sdk-core";
const client = GphApiClient("7RvkMW9s8zgW4j38YgQfYe8g6EYShhYX");
console.log("Need to remove API key from codebase");

export default function(keyword, offset = 0, limit = 100) {
    return client.search('gifs', {
        q: keyword,
        limit,
        offset,
    });
}
