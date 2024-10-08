package com.ExhibitScape.app.dto.member;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MailVO {

	private String title;
	private String content;
	private List<String> recipientList;
}
