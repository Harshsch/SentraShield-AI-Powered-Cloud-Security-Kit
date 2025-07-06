import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['INPUT_LOG_TABLE'])

def lambda_handler(event, context):
    body = json.loads(event['body'])
    
    log_entry = {
        'id': str(datetime.utcnow().timestamp()),
        'timestamp': datetime.utcnow().isoformat(),
        'ip': body.get('ip', 'unknown'),
        'username': body.get('username', 'unknown'),
        'comment': body.get('comment', ''),
        'reason': body.get('reason', 'unknown')
    }

    table.put_item(Item=log_entry)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Suspicious input logged successfully'})
    }
