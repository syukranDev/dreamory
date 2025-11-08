import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey || apiKey !== '1234567890') {
            return false;
        }

        return true;
    }
}