package hcmus.beohoang98.bao_an_bank.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Bao An Bank API"))
@SecurityScheme(
    name = "OAuth2",
    bearerFormat = "JWT",
    type = SecuritySchemeType.OAUTH2,
    flows =
        @OAuthFlows(
            password = @OAuthFlow(tokenUrl = "/api/oauth/token", refreshUrl = "/api/oauth/token"),
            clientCredentials =
                @OAuthFlow(
                    authorizationUrl = "/api/oauth/authorize",
                    tokenUrl = "/api/oauth/token",
                    refreshUrl = "/api/oauth/token",
                    scopes = {})))
public class OpenAPIConfig {}
