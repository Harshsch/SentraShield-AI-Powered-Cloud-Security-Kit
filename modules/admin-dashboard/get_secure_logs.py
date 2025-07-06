import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SentraShieldInputLogs')

def lambda_handler(event, context):
    try:
        response = table.scan(Limit=50)
        logs = response.get('Items', [])

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(logs)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
