import json
import requests
import boto3
import os

def lambda_handler(event, context):
    # Dune Analytics API setup
    api_key = os.environ['API_KEY']
    fee_contribution_url = f"https://api.dune.com/api/v1/query/3334854/results?api_key={api_key}"
    # S3 setup
    s3 = boto3.client('s3')
    bucket_name = 'atpr'
    file_name = 'render/daily_number.js'
    try:
        # Query Dune Analytics for daily ETH contribution
        response = requests.get(fee_contribution_url)
        response.raise_for_status()  # Will raise an HTTPError if the HTTP request returned an unsuccessful status code
        # Extract daily ETH contribution
        json_data = response.json()
        daily_eth_contribution = json_data['result']['rows'][0]['collective_contribution_by_day']
        annual_eth_contribution = daily_eth_contribution * 365
        # Prepare content to write to S3
        new_content = f'const dailyNumber = {annual_eth_contribution};'

        # Write to S3
        s3.put_object(Body=new_content, Bucket=bucket_name, Key=file_name)

        return {
            'statusCode': 200,
            'body': json.dumps(f'Updated annual ETH contribution to {annual_eth_contribution}')
        }

    except requests.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"HTTP error occurred: {http_err}")
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {e}")
        }
