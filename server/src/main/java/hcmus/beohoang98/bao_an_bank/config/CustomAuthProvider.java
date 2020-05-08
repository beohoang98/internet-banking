package hcmus.beohoang98.bao_an_bank.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import hcmus.beohoang98.bao_an_bank.models.User;
import hcmus.beohoang98.bao_an_bank.repos.UserRepository;

@Component
@Import(BCryptPassEncoder.class)
public class CustomAuthProvider implements AuthenticationProvider {
  @Autowired UserRepository userRepository;

  @Autowired PasswordEncoder passwordEncoder;

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    String email = authentication.getName();
    String pass = authentication.getCredentials().toString();

    User user = userRepository.findByEmail(email);
    if (user == null) {
      throw new UsernameNotFoundException(email);
    }
    if (passwordEncoder.matches(pass, user.getPassword())) {
      return new UsernamePasswordAuthenticationToken(email, pass, user.getAuthorities());
    }

    throw new BadCredentialsException(email);
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return authentication.equals(UsernamePasswordAuthenticationToken.class);
  }
}
