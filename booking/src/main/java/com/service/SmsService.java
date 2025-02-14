package com.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {
	
	public void sendSms(String phoneNumber, String message) {
        // 模擬發送簡訊
        System.out.println("發送簡訊至: " + phoneNumber);
        System.out.println("內容: " + message);
        System.out.println("-------------");
    }
}
	    
//	    public void sendSms(String phoneNumber, String message) {
//	        System.out.println("簡訊發送至 " + phoneNumber);
//	        System.out.println("發送內容：" + message);
//	        System.out.println("----------------------");
//	    }
//	    
//	    public void sendBookingSms(String phoneNumber, String date, String time) {
//	        String message = String.format("您已成功預約。日期：%s，時間：%s", date, time);
//	        sendSms(phoneNumber, message);
//	    }
//
//	    public void sendModifySms(String phoneNumber, String date, String time) {
//	        String message = String.format("您的預約已修改。日期：%s，時間：%s", date, time);
//	        sendSms(phoneNumber, message);
//	    }
//
//	    public void sendCancelSms(String phoneNumber, String date, String time) {
//	        String message = String.format("您的預約已取消。日期：%s，時間：%s", date, time);
//	        sendSms(phoneNumber, message);
//	    }
	
