package com.musicstore.azure.dto;

import lombok.*;

import java.io.InputStream;

@Data
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FileDto {

	private String path;
	private String fileName;
	private InputStream inputStream;

}
