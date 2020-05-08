package hcmus.beohoang98.bao_an_bank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PassEncoder {
  @Bean
  public BCryptPasswordEncoder passEncoder() {
    return new BCryptPasswordEncoder(5);
  }
}
