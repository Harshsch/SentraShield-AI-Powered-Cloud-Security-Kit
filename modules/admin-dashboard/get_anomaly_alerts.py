import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('AnomalyAlerts')

def lambda_handler(event, context):
    try:
        response = table.scan(Limit=50)
        alerts = response.get('Items', [])

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(alerts)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
