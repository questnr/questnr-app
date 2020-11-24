import { environment } from "~/environments/environment";

const staticLoginReponse = {
    "loginSuccess": true,
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicmlqZXNobGFra2FkMjIiLCJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn0seyJhdXRob3JpdHkiOiJST0xFX1VTRVIifV0sImNyZWF0ZWQiOjE2MDYxNTI4Mzc3MDMsIm5hbWUiOiJicmlqZXNobGFra2FkMjIiLCJlbWFpbElkIjoiZHVtbXkxQGR1bW15LnF1ZXN0bnIuY29tIiwiaWQiOjEsImV4cCI6MTYwNjc1NzYzNywiaWF0IjoxNjA2MTUyODM3LCJzbHVnIjoiYnJpamVzaGxha2thZDIyLTMwMTk4MjUwMzMifQ.YfiveGYVxCxlOQcC3T2M7EGFFXJidsVED58910e7evs-jQO7VLdpVGDeS3S-9gdmd51wa-qC6wlMdzFUkElRHg",
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