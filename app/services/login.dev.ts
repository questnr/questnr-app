import { environment } from "~/environments/environment";

const staticLoginReponse = {
    "loginSuccess": true,
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicmlqZXNobGFra2FkMjIiLCJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn0seyJhdXRob3JpdHkiOiJST0xFX1VTRVIifV0sImNyZWF0ZWQiOjE2MDc1MzMxNTMyMTUsIm5hbWUiOiJCcmlqZXNoIExha2thZCIsImVtYWlsSWQiOiJkdW1teTFAZHVtbXkucXVlc3Ruci5jb20iLCJpZCI6MSwiZXhwIjoxNjA4MTM3OTUzLCJpYXQiOjE2MDc1MzMxNTMsInNsdWciOiJicmlqZXNobGFra2FkMjItMzAxOTgyNTAzMyJ9.wTlxx0SRI9iwmhRlEGyuTZBMrIUReJr9Bzj-GmAktYFhbeifnhF9QQGgiR-6XC7BX26kSP8lbfEMwQXjkHXY1A",
    "userName": "brijeshlakkad22",
    "errorMessage": null,
    "communitySuggestion": false,
    "firstAttempt": true
};

const staticLoginReponse2 = {
    "loginSuccess": true,
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicmlqZXNobGFra2FkIiwicm9sZSI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn0seyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJjcmVhdGVkIjoxNjA2MDM2OTU5MTU0LCJuYW1lIjoiQnJpamVzaCBMYWtrYWQiLCJlbWFpbElkIjoiYnJpamVzaGxha2thZDIyQGdtYWlsLmNvbSIsImlkIjoxLCJleHAiOjE2MDY2NDE3NTksImlhdCI6MTYwNjAzNjk1OSwic2x1ZyI6ImJyaWplc2gtbGFra2FkLTA0ODc1MTA2NzYifQ.VBSxsSguCc6K_KmoVH4QKHTJSpwUfzzHBt6mu_ndl-I15fW_4mzmtMGNCQZ0YfmYTxjBMC4j8rlsfw_qWNEXYw",
    "userName": "brijeshlakkad",
    "errorMessage": null,
    "communitySuggestion": false,
    "firstAttempt": true
};

export default environment.production ? staticLoginReponse2 : staticLoginReponse;