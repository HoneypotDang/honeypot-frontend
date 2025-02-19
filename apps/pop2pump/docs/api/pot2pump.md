# Pot2Pump API Documentation

This document outlines the API endpoints for the Pot2Pump launch functionality.

## Table of Contents
- [Create Launch](#create-launch)
- [Get Launch Info](#get-launch-info)

## Create Launch

Creates a new Pot2Pump launch project in the system.

### Endpoint 
POST /api/launch/create-pot2pump-launch
### Request Headers
Content-Type: application/json

### Request Body
```json
{
  "pair": Address,
  "provider": Address,
  "chain_id": number,
  "projectName": string,
  "project_logo": string, //optional
  "banner_url": string, //optional
  "description": string, //optional
  "twitter": string, //optional
  "website": string, //optional
}
```

### Response
```json
{
  "status": "success",
  "message": "Launch created successfully",
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message" 
}
```

### Notes
- This endpoint can only create pot2pump, if the launch info already exists, it will not be created. If you want to update the launch info, you can use the update launch via frontend.
- If the pair is not valid, the launch will not be created.
- If the pair is already in the system, the launch will not be created.
- If the pair is not in the system, the launch will be created.


## Get Launch Info

Retrieves detailed information about a specific launch.

### Endpoint
GET /api/launch/get-launch-info

### Request Headers
Content-Type: application/json

### Query Parameters
```json
{
  "pair": Address,
  "chain_id": number,
}
```

### Response
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "pair": "0xe123bf3fc7430870df775c3134bea9665bc5e7f8",
        "provider": "0x9f593f190cdF2107148a2bA6aB617F010387BCa2",
        "launch_token": "0x9f593f190cdF2107148a2bA6aB617F010387BCa2",
        "raising_token": "0x9f593f190cdF2107148a2bA6aB617F010387BCa2",
        "chain_id": "80085",
        "twitter": "https://twitter.com/meme_pump",
        "website": "https://meme.pump",
        "telegram": "https://t.me/meme_pump",
        "name": "Meme Pump",
        "description": "Meme Pump is a meme token that pumps",
        "logo_url": "https://meme.pump/logo.png",
        "project_type": "meme",
        "banner_url": "https://meme.pump/banner.png",
        "beravote_space_id": "1234567890"
    },
    "message": "Success"
}
```

### Error Response
```json
{
    "status": "error",
    "message": "No data found"
}

{
  "status": "error",
  "message": "Error message" 
}
```

### Notes
- This endpoint can only get pot2pump, if the launch info does not exist, it will return an error.
- If the pair is not in the system, it will return an error.
- If the pair is in the system, it will return the launch info.

