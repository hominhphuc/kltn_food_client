package dev.webservice_client.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

public class CustomOAuth2User implements OAuth2User {

    private OAuth2User oAuth2User;
    private KhachHang khachHang;

    public CustomOAuth2User(OAuth2User oAuth2User, KhachHang khachHang) {
        this.oAuth2User = oAuth2User;
        this.khachHang = khachHang;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oAuth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthorityUtils.commaSeparatedStringToAuthorityList(khachHang.getRoleName());
    }

    @Override
    public String getName() {
        return oAuth2User.getAttribute("name");
    }

    public String getEmail() {
        return oAuth2User.getAttribute("email");
    }

    public String getFullName() {
        return this.khachHang.getName();
    }

    public String getImage() {
        return this.khachHang.getAvatar();
    }

    public UUID getUserId() {
        return this.khachHang.getUserId();
    }

    public String getAddress() {
        return this.khachHang.getAddress();
    }

    public String getPhoneNumber() {
        return this.khachHang.getPhone();
    }
}
