package hcmus.beohoang98.bao_an_bank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BCryptPassEncoder {
  @Bean
  public PasswordEncoder passEncoder() {
    return new BCryptPasswordEncoder(5);
  }
}
