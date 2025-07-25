import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin 초기화 (서버 측)
if (getApps().length === 0 && process.env.FIREBASE_PROJECT_ID) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const adminAuth = getAuth();

// Supabase 클라이언트 (서버용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 사용자 프로필 생성 API
 * POST /api/auth/profile
 */
export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Firebase Admin으로 토큰 검증
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { id, email, display_name, role, is_verified, metadata } = body;

    // 입력 검증
    if (!id || !email || !display_name || !role) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토큰의 uid와 요청된 id가 일치하는지 확인
    if (decodedToken.uid !== id) {
      return NextResponse.json(
        { error: '토큰과 사용자 ID가 일치하지 않습니다.' },
        { status: 403 }
      );
    }

    // 유효한 역할인지 확인
    const validRoles = ['user', 'employer', 'curator'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: '유효하지 않은 역할입니다.' },
        { status: 400 }
      );
    }

    // 이미 프로필이 존재하는지 확인
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single();

    if (existingProfile) {
      // 기존 프로필이 있으면 업데이트
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          email,
          display_name,
          role,
          is_verified: is_verified || false,
          metadata: metadata || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Profile update error:', updateError);
        return NextResponse.json(
          { error: '프로필 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data: updatedProfile,
        message: '프로필이 업데이트되었습니다.'
      });
    } else {
      // 새 프로필 생성
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id,
          email,
          display_name,
          role,
          is_verified: is_verified || false,
          metadata: metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return NextResponse.json(
          { error: '프로필 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data: newProfile,
        message: '프로필이 생성되었습니다.'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 프로필 조회 API
 * GET /api/auth/profile
 */
export async function GET(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Firebase Admin으로 토큰 검증
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      );
    }

    // 프로필 조회
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decodedToken.uid)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: '프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: profile
    });

  } catch (error) {
    console.error('Profile GET API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 프로필 업데이트 API
 * PATCH /api/auth/profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Firebase Admin으로 토큰 검증
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { 
      display_name, 
      phone, 
      location, 
      bio, 
      experience_level, 
      specialties, 
      company_name,
      avatar_url 
    } = body;

    // 업데이트할 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (display_name !== undefined) updateData.display_name = display_name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (experience_level !== undefined) updateData.experience_level = experience_level;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (company_name !== undefined) updateData.company_name = company_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    // 프로필 업데이트
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', decodedToken.uid)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: '프로필 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedProfile,
      message: '프로필이 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('Profile PATCH API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 