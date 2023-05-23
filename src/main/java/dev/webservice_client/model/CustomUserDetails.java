package dev.webservice_client.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {

	
	
	
    private KhachHang khachHang;

    public CustomUserDetails(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthorityUtils.commaSeparatedStringToAuthorityList(khachHang.getRoleName());
    }

    @Override
    public String getPassword() {
        return khachHang.getPassword();
    }

    @Override
    public String getUsername() {
        return khachHang.getPhone();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
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
