import boto3
import json
import random

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'atpr'
    file_name = 'render/daily_number.js'
    random_number = random.randint(1, 100)
    
    new_content = f'const dailyNumber = {random_number};'
    
    try:
        s3.put_object(Body=new_content, Bucket=bucket_name, Key=file_name)
        return {
            'statusCode': 200,
            'body': json.dumps(f'Updated number to {random_number}')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }